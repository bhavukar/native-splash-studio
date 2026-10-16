import { GeneratedFile, SplashConfig, FrameworkType } from './types.js';
export interface GeneratedSplashBundle {
    framework: FrameworkType;
    appName: string;
    templateId: string;
    files: GeneratedFile[];
}
export declare function extractPathDataFromSvg(svg: string): string;
export declare function isColorLight(hex: string): boolean;
export declare function generateAllSplashAssets(config: SplashConfig, targetFramework?: FrameworkType): GeneratedSplashBundle;
//# sourceMappingURL=generator.d.ts.map