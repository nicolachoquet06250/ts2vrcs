#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { Transpiler } from './transpiler.js';

const program = new Command();

function isTypeScriptFile(filePath: string): boolean {
    return filePath.endsWith('.ts') && !filePath.endsWith('.d.ts');
}

interface CliOptions {
    output: string;
    sdk?: string;
    udonsharp?: string;
}

function transpileFile(inputFile: string, outputRoot: string, baseDir?: string, cliOptions?: CliOptions) {
    const sourceCode = fs.readFileSync(inputFile, 'utf-8');
    const transpiler = new Transpiler(sourceCode, { sdkVersion: cliOptions?.sdk, udonSharpVersion: cliOptions?.udonsharp });
    const result = transpiler.transpile();

    // Preserve relative structure when baseDir is provided
    const rel = baseDir ? path.relative(baseDir, inputFile) : path.basename(inputFile);
    const relNoExt = rel.replace(/\.ts$/, '');
    const outputPath = path.join(outputRoot, relNoExt + '.cs');

    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, result);
    console.log(`Successfully compiled ${inputFile} to ${outputPath}`);
}

function transpileDirectory(inputDir: string, outputRoot: string, cliOptions?: CliOptions) {
    const stack: string[] = [inputDir];
    while (stack.length > 0) {
        const current = stack.pop()!;
        const entries = fs.readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
                stack.push(fullPath);
            } else if (entry.isFile()) {
                if (isTypeScriptFile(fullPath)) {
                    transpileFile(fullPath, outputRoot, inputDir, cliOptions);
                }
            }
        }
    }
}

program
    .name('ts2csvrc')
    .description('Compiles TypeScript to C# for UdonSharp (VRChat)')
    .version('0.0.1')
    .argument('<path>', 'TypeScript file or directory to compile')
    .option('-o, --output <dir>', 'Output directory', './dist-cs')
    .option('--sdk <version>', 'VRChat SDK version (e.g., sdk3-worlds, sdk3-avatars)')
    .option('--udonsharp <version>', 'UdonSharp version (e.g., 1.x, 2.x)')
    .action((inputPath, options: CliOptions) => {
        const resolved = path.resolve(inputPath);
        if (!fs.existsSync(resolved)) {
            console.error(`Error: Path ${inputPath} not found.`);
            process.exit(1);
        }

        const outputDir = path.resolve(options.output);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const stat = fs.statSync(resolved);
        if (stat.isDirectory()) {
            transpileDirectory(resolved, outputDir);
        } else if (stat.isFile()) {
            if (!isTypeScriptFile(resolved)) {
                console.error('Error: Only .ts files are supported as single-file inputs.');
                process.exit(1);
            }
            transpileFile(resolved, outputDir, undefined, options);
        } else {
            console.error('Error: Input path must be a file or a directory.');
            process.exit(1);
        }
    });

program.parse();
