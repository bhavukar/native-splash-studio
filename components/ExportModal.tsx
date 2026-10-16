'use client';

import React, { useState } from 'react';
import { StudioConfig, PlatformType, PlatformExport } from '../lib/types';
import { generateAndroidNative } from '../lib/generators/androidGenerator';
import { generateIosNative } from '../lib/generators/iosGenerator';
import { generateFlutterNative } from '../lib/generators/flutterGenerator';
import { generateReactNativeNative } from '../lib/generators/reactNativeGenerator';
import { exportPlatformZip, triggerBlobDownload } from '../lib/zipExporter';
import { X, Download, Copy, Check, FileCode } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StudioConfig;
}

export function ExportModal({ isOpen, onClose, config }: ExportModalProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformType>('android');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  if (!isOpen) return null;

  const exports: Record<PlatformType, PlatformExport> = {
    android: generateAndroidNative(config),
    ios: generateIosNative(config),
    flutter: generateFlutterNative(config),
    'react-native': generateReactNativeNative(config),
  };

  const currentExport = exports[activePlatform];
  const activeFile = currentExport.files[selectedFileIndex] || currentExport.files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const blob = await exportPlatformZip(currentExport, config);
      triggerBlobDownload(
        blob,
        `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${activePlatform}-native-splash.zip`
      );
    } catch (err) {
      console.error('ZIP export error:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0E0E11] border border-white/[0.08] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0E0E11]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-200">
              Export Native Splash Code
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              ({currentExport.platformName})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-xs transition active:scale-[0.98] disabled:opacity-50"
            >
              <Download size={13} />
              <span>{isExportingZip ? 'Packaging...' : 'Download ZIP'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 flex items-center justify-center transition"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1 px-5 py-2 bg-[#09090B] border-b border-white/[0.04]">
          {[
            { id: 'android', label: 'Android (Kotlin/XML)' },
            { id: 'ios', label: 'iOS (Swift/Storyboard)' },
            { id: 'flutter', label: 'Flutter (Native Drop-in)' },
            { id: 'react-native', label: 'React Native (Drop-in)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePlatform(tab.id as PlatformType);
                setSelectedFileIndex(0);
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activePlatform === tab.id
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Left */}
          <div className="w-64 bg-[#09090B] border-r border-white/[0.06] flex flex-col justify-between overflow-y-auto">
            <div className="p-3 space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 block mb-2 px-1">
                Files
              </span>

              {currentExport.files.map((file, idx) => {
                const isSelected = idx === selectedFileIndex;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition ${
                      isSelected
                        ? 'bg-zinc-800 text-zinc-200'
                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                    }`}
                  >
                    <FileCode size={13} className="flex-shrink-0 text-zinc-500" />
                    <span className="text-xs font-mono truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Setup Checklist */}
            <div className="p-3 border-t border-white/[0.04] bg-[#0C0C0E]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5 font-semibold">
                Setup
              </span>
              <ul className="space-y-1">
                {currentExport.setupGuide.map((step, idx) => (
                  <li key={idx} className="text-[11px] text-zinc-400 leading-snug">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Viewer Right */}
          <div className="flex-1 flex flex-col bg-[#0C0C0E]">
            {/* File Path Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
              <span className="text-[11px] font-mono text-zinc-400">
                {activeFile.path}
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-zinc-300 select-text">
              <pre className="whitespace-pre">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
