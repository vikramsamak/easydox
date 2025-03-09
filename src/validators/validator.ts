import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';

export function validateSource(source?: string): boolean {
  if (!source || source.trim() === '') {
    console.log(chalk.red('❌ Error: Source directory cannot be empty.'));
    return false;
  }

  const resolvedPath = path.resolve(source);

  if (!fs.existsSync(resolvedPath)) {
    console.log(
      chalk.red(`❌ Error: Source directory "${resolvedPath}" does not exist.`)
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
    console.log(
      chalk.red(`❌ Error: Invalid format(s): ${invalidFormats.join(', ')}`)
    );
    console.log(chalk.yellow(`✅ Valid formats: ${validFormats.join(', ')}`));
    return false;
  }
  return true;
}

export function validateOutput(output?: string): boolean {
  if (!output || output.trim() === '') {
    console.log(chalk.red('❌ Error: Output directory cannot be empty.'));
    return false;
  }

  fs.ensureDirSync(output);
  return true;
}
