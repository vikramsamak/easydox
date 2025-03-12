import path from 'path';
import fs from 'fs';
import { toTitleCase } from './totitlecase';

export function generateMarkdownHeader(): string {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const packageName = packageJson.name || 'AutoDocs';
    const formattedName = toTitleCase(packageName);
    const packageDescription = packageJson.description?.trim() || '';

    let header = `# ${formattedName}\n\n`;
    if (packageDescription) {
      header += `${packageDescription}\n\n`;
    }

    return header;
  } catch (error) {
    console.error('⚠️ Error reading package.json:', error);
    return `# AutoDocs\n\n`; // Fallback title
  }
}
