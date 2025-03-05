import fs from 'fs-extra';
import chalk from 'chalk';
import { promptUserForOptions } from './interactive';
import { validateFormat, validateOutput, validateSource } from './validator';

export async function runCLI(source?: string, options: any = {}) {
  options = {
    format: options.format || 'mdx,md,json',
    output: options.output || 'docs',
    enableAI: options.enableAI ?? false,
  };

  console.log(chalk.blue(`\n📄 AutoDocs: Generating documentation...\n`));

  // If no source OR missing options, start interactive mode
  if (!source || !options.format || !options.output) {
    const answers = await promptUserForOptions({ source, ...options });

    source = source || answers.source;
    options = { ...options, ...answers };
  }

  if (
    !validateSource(source) ||
    !validateFormat(options.format) ||
    !validateOutput(options.output)
  ) {
    console.log(chalk.red('🚨 Exiting due to invalid input.'));
    return;
  }

  console.log(chalk.green(`✅ Processing: ${source}`));
  console.log(`🔹 Output format: ${options.format}`);
  console.log(`📂 Saving to: ${options.output}`);
  console.log(`🤖 AI Comments: ${options.enableAI ? 'Enabled' : 'Disabled'}`);

  // Ensure output directory exists

  // (TODO) Implement file parsing & documentation generation
}
