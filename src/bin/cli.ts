#!/usr/bin/env node
import { Command } from 'commander';
import { runCLI } from '../index';

const program = new Command();

program
  .name('easydox')
  .description(
    '📄 AutoDocs - Generate documentation for JavaScript/TypeScript projects'
  )
  .version('1.0.0')
  .option('-s, --source <directory>', 'Source directory to scan')
  .option(
    '-f, --format <format>',
    'Output format: mdx, md, json',
    'mdx,md,json'
  )
  .option('-o, --output <directory>', 'Output directory', 'docs')
  .addHelpText(
    'after',
    `
Examples:
  $ easydox                                                        # Start interactive mode
  $ easydox --source src/                                          # Scan 'src/' and ask for other options
  $ easydox --source src/ --format md --output docs --enableAI     # Fully automated mode (CI/CD friendly)

📢 Tip: Run 'easydox -h' to view available options at any time!
`
  )
  .action((options) => {
    const { source } = options;
    runCLI(source, options);
  });

program.parse(process.argv);
