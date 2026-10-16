'use client';

import React, { useState } from 'react';
import { StudioConfig, PlatformType, PlatformExport } from '../lib/types';
import { generateAndroidNative } from '../lib/generators/androidGenerator';
import { generateIosNative } from '../lib/generators/iosGenerator';
import { generateFlutterNative } from '../lib/generators/flutterGenerator';
import { generateReactNativeNative } from '../lib/generators/reactNativeGenerator';
import { exportPlatformZip, triggerBlobDownload } from '../lib/zipExporter';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  Sparkles,
  Bot,
  Apple,
  Layers,
  Atom,
} from 'lucide-react';

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

  // Generate for all platforms
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

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3B82F6', '#6366F1', '#10B981', '#F59E0B'],
      });
    } catch (err) {
      console.error('ZIP export error:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Download size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Native Splash Screen Exporter</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Native Code
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hardware-accelerated native assets for Android, iOS, Flutter, and React Native.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition active:scale-95 disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isExportingZip ? 'Packaging ZIP...' : `Download ${currentExport.platformName} ZIP`}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80">
          {[
            { id: 'android', label: 'Android Native', icon: <Bot size={14} /> },
            { id: 'ios', label: 'iOS Native', icon: <Apple size={14} /> },
            { id: 'flutter', label: 'Flutter Drop-in', icon: <Layers size={14} /> },
            { id: 'react-native', label: 'React Native Drop-in', icon: <Atom size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePlatform(tab.id as PlatformType);
                setSelectedFileIndex(0);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                activePlatform === tab.id
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: File Tree & Setup Checklist */}
          <div className="w-72 bg-slate-950/40 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
            {/* File List */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 px-2">
                Generated Native Files ({currentExport.files.length})
              </span>

              {currentExport.files.map((file, idx) => {
                const isSelected = idx === selectedFileIndex;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <FileCode size={14} className="mt-0.5 flex-shrink-0 text-blue-400" />
                    <div className="truncate">
                      <p className="text-xs font-mono font-medium truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{file.path}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step-by-Step Integration Guide */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-2 font-bold flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>30-Second Setup</span>
              </span>
              <ul className="space-y-1.5">
                {currentExport.setupGuide.map((step, idx) => (
                  <li key={idx} className="text-[11px] text-slate-300 leading-snug">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950">
            {/* Code Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  {activeFile.path}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {activeFile.language}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Editor Preview */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 select-text">
              <pre className="whitespace-pre">
                <code>{activeFile.content}</code>
              </pre>
            </div>

            {/* File Description Footer */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/50 text-[11px] text-slate-400">
              ℹ️ {activeFile.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
