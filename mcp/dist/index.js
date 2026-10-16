#!/usr/bin/env node
/**
 * Native Splash Studio — Model Context Protocol (MCP) Server
 * Enables AI coding assistants and autonomous agents to inspect mobile codebases
 * (Flutter, React Native, Android, iOS) and automatically inject production-grade
 * native animated splash screens with zero manual configuration.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { detectProjectStack } from './detector.js';
import { TEMPLATES } from './templatesData.js';
import { generateAllSplashAssets } from './generator.js';
import { injectNativeSplash } from './injector.js';
import { validateSplashSetup } from './validator.js';
async function main() {
    const server = new McpServer({
        name: 'native-splash-mcp',
        version: '1.0.0',
    });
    // 1. Detect Project Stack
    server.registerTool('detect_project_stack', {
        description: 'Inspects a mobile project codebase (Flutter, React Native, Android Native, iOS Native) to identify framework, package name, bundle ID, res/directories, Gradle setup, and existing splash configurations.',
        inputSchema: {
            projectPath: z
                .string()
                .optional()
                .describe('Absolute or relative path to the mobile project root. Defaults to current directory.'),
        },
    }, async (args) => {
        try {
            const targetPath = args.projectPath || process.cwd();
            const stack = await detectProjectStack(targetPath);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(stack, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [{ type: 'text', text: `Failed to detect project stack: ${err.message}` }],
            };
        }
    });
    // 2. List Native Motion Engines
    server.registerTool('list_native_templates', {
        description: 'Lists all 24 production-grade native motion engines with descriptions, categories, default duration, and native physics interpolators.',
        inputSchema: {
            category: z
                .enum(['All', 'Minimal', 'Modern', 'Cinematic', 'High Energy', 'Luxury'])
                .optional()
                .default('All')
                .describe('Filter templates by category'),
        },
    }, async (args) => {
        const category = args.category || 'All';
        const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        totalCount: filtered.length,
                        category,
                        templates: filtered.map((t) => ({
                            id: t.id,
                            name: t.name,
                            category: t.category,
                            tagline: t.tagline,
                            defaultDurationMs: t.defaultDurationMs,
                            description: t.description,
                            androidInterpolator: t.androidInterpolator,
                            iosTimingCurve: t.iosTimingCurve,
                            features: t.features,
                        })),
                    }, null, 2),
                },
            ],
        };
    });
    // 3. Get Template Details
    server.registerTool('get_template_details', {
        description: 'Retrieves comprehensive physics details, interpolators, and sample configurations for a specific native splash animation template ID.',
        inputSchema: {
            templateId: z.string().describe("Animation template ID (e.g. 'spring-bloom', 'apple-intelligence', 'netflix-ribbon')"),
        },
    }, async (args) => {
        const template = TEMPLATES.find((t) => t.id === args.templateId);
        if (!template) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Template '${args.templateId}' not found. Available IDs: ${TEMPLATES.map((t) => t.id).join(', ')}`,
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(template, null, 2),
                },
            ],
        };
    });
    // 4. Generate Splash Assets
    server.registerTool('generate_splash_assets', {
        description: 'Generates ready-to-use native splash code and assets (Android 12+ AVD, animators, day/night themes, iOS storyboard, xcassets, Swift overlay) for inspection without touching disk.',
        inputSchema: {
            templateId: z.string().describe("Animation template ID (e.g. 'spring-bloom', 'path-trace')"),
            appName: z.string().optional().describe('Application name'),
            logoSvg: z.string().optional().describe('SVG markup string of the logo'),
            backgroundColor: z.string().optional().default('#0a0b10').describe('Background color in hex (#0a0b10)'),
            accentColor: z.string().optional().default('#6366f1').describe('Accent color in hex (#6366f1)'),
            durationMs: z.number().optional().default(850).describe('Animation duration in milliseconds'),
            platform: z.enum(['all', 'flutter', 'react-native', 'android', 'ios']).optional().default('all'),
        },
    }, async (args) => {
        try {
            const bundle = generateAllSplashAssets({
                templateId: args.templateId,
                appName: args.appName || 'App',
                logoSvg: args.logoSvg,
                backgroundColor: args.backgroundColor,
                accentColor: args.accentColor,
                durationMs: args.durationMs,
            }, args.platform || 'flutter');
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            templateId: bundle.templateId,
                            appName: bundle.appName,
                            fileCount: bundle.files.length,
                            files: bundle.files.map((f) => ({
                                name: f.name,
                                path: f.path,
                                language: f.language,
                                description: f.description,
                                contentLength: f.content.length,
                                previewSnippet: f.content.slice(0, 300) + '...',
                            })),
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [{ type: 'text', text: `Failed to generate splash assets: ${err.message}` }],
            };
        }
    });
    // 5. Inject Native Splash (Direct Injection)
    server.registerTool('inject_native_splash', {
        description: 'Directly and non-destructively injects a native animated splash screen into a target mobile project (Flutter, React Native, Native Android, Native iOS). Writes AVD and storyboard assets, safely merges color/theme XML, configures AndroidManifest.xml, and wires MainActivity / AppDelegate.',
        inputSchema: {
            projectPath: z
                .string()
                .optional()
                .describe('Path to mobile project root directory. Defaults to current directory.'),
            templateId: z
                .string()
                .describe("Selected animation template ID (e.g. 'spring-bloom', 'apple-iris', 'netflix-ribbon')"),
            appName: z.string().optional().describe('App name override'),
            logoSvg: z.string().optional().describe('SVG string of the logo'),
            logoFilePath: z.string().optional().describe('Relative or absolute path to an existing SVG logo file'),
            backgroundColor: z.string().optional().default('#0a0b10').describe('Background color in hex (#0a0b10)'),
            accentColor: z.string().optional().default('#6366f1').describe('Accent brand color in hex (#6366f1)'),
            durationMs: z.number().optional().default(850).describe('Animation duration in ms'),
            dryRun: z.boolean().optional().default(false).describe('If true, simulates all modifications without modifying disk files'),
        },
    }, async (args) => {
        try {
            const targetPath = args.projectPath || process.cwd();
            const result = await injectNativeSplash(targetPath, {
                templateId: args.templateId,
                appName: args.appName,
                logoSvg: args.logoSvg,
                logoFilePath: args.logoFilePath,
                backgroundColor: args.backgroundColor,
                accentColor: args.accentColor,
                durationMs: args.durationMs,
            }, args.dryRun);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [{ type: 'text', text: `Splash injection failed: ${err.message}` }],
            };
        }
    });
    // 6. Validate Splash Setup
    server.registerTool('validate_splash_setup', {
        description: 'Audits an existing mobile project to verify that the native splash screen is correctly wired up, dependencies are present, themes are set, and no white flashes or cold boot lags will occur.',
        inputSchema: {
            projectPath: z
                .string()
                .optional()
                .describe('Path to mobile project root directory. Defaults to current directory.'),
        },
    }, async (args) => {
        try {
            const targetPath = args.projectPath || process.cwd();
            const report = await validateSplashSetup(targetPath);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(report, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [{ type: 'text', text: `Splash validation failed: ${err.message}` }],
            };
        }
    });
    // Connect stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🚀 Native Splash Studio MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in Native Splash MCP Server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map