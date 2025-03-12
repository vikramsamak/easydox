import fs from 'fs';
import path from 'path';
import { ComponentInfo } from '../types';
import { fileParser } from './fileparser';
import { logMessage } from '../utils';

export function directoryParser(sourceDir: string): ComponentInfo[] {
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    console.error(
      `❌ Error: Source directory "${sourceDir}" does not exist or is not a directory.`
    );
    process.exit(1);
  }

  logMessage(`🔍 Parsing components in directory: ${sourceDir}`, 'green');

  const files = fs.readdirSync(sourceDir);

  let allComponents: ComponentInfo[] = [];

  const validExtensions = ['.ts', '.js', '.jsx', '.tsx'];

  files.forEach((file) => {
    const fullPath = path.join(sourceDir, file);
    if (
      fs.statSync(fullPath).isFile() &&
      validExtensions.some((ext) => fullPath.endsWith(ext))
    ) {
      logMessage(`📄 Processing file: ${file}`, 'cyan');
      allComponents = allComponents.concat(fileParser(fullPath));
    }
  });

  return allComponents;
}
