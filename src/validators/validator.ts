import fs from 'fs-extra';
import path from 'path';
import { logMessage } from '../utils';

export function validateSource(source?: string): boolean {
  if (!source || source.trim() === '') {
    logMessage('❌ Error: Source directory cannot be empty.', 'red');
    return false;
  }

  const resolvedPath = path.resolve(source);

  if (!fs.existsSync(resolvedPath)) {
    logMessage(
      `❌ Error: Source directory "${resolvedPath}" does not exist.`,
      'red'
    );
    return false;
  }
  return true;
}

export function validateFormat(format: string): boolean {
  const validFormats = ['mdx', 'md', 'json'];
  const formats = format.split(',').map((f) => f.trim());

  const invalidFormats = formats.filter((f) => !validFormats.includes(f));
  if (invalidFormats.length > 0) {
    logMessage(
      `❌ Error: Invalid format(s): ${invalidFormats.join(', ')}`,
      'red'
    );
    logMessage(`✅ Valid formats: ${validFormats.join(', ')}`, 'yellow');
    return false;
  }
  return true;
}

export function validateOutput(output?: string): boolean {
  if (!output || output.trim() === '') {
    logMessage('❌ Error: Output directory cannot be empty.', 'red');
    return false;
  }

  fs.ensureDirSync(output);
  return true;
}
