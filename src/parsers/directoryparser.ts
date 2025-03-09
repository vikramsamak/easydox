import fs from 'fs';
import path from 'path';
import { ComponentInfo } from '../types';
import { fileParser } from './fileparser';

export function directoryParser(sourceDir: string): ComponentInfo[] {
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    console.error(
      `❌ Error: Source directory "${sourceDir}" does not exist or is not a directory.`
    );
    process.exit(1);
  }

  console.log(`🔍 Parsing components in directory: ${sourceDir}\n`);
  const files = fs.readdirSync(sourceDir);
  let allComponents: ComponentInfo[] = [];
  const validExtensions = ['.ts', '.js', '.jsx', '.tsx'];

  files.forEach((file) => {
    const fullPath = path.join(sourceDir, file);
    if (
      fs.statSync(fullPath).isFile() &&
      validExtensions.some((ext) => fullPath.endsWith(ext))
    ) {
      console.log(`📄 Processing file: ${file}`);
      allComponents = allComponents.concat(fileParser(fullPath));
    }
  });

  return allComponents;
}
