import fs from 'fs';
import path from 'path';
import { ComponentInfo } from '../types';
import { fileParser } from './fileparser';
import { logMessage } from '../utils';

export function directoryParser(sourceDir: string): ComponentInfo[] {
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    logMessage(
      `❌ Error: Source directory "${sourceDir}" does not exist or is not a directory.`,
      'red'
    );
    process.exit(1);
  }

  logMessage(`🔍 Parsing components in directory: ${sourceDir}`, 'green');

  const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  let allComponents: ComponentInfo[] = [];

  function walk(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (
        stat.isFile() &&
        validExtensions.some((ext) => fullPath.endsWith(ext))
      ) {
        allComponents = allComponents.concat(fileParser(fullPath));
      }
    });
  }

  walk(sourceDir);

  return allComponents;
}
