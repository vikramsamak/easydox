import chalk from 'chalk';
import { logMessage, promptUserForOptions } from './utils';
import {
  validateFormat,
  validateOutput,
  validateSource,
} from './validators/validator';
import { directoryParser } from './parsers';
import { jsonGenerator, markdownGenerator } from './generators';
import { writeFile } from './utils';
import { CLIOptions } from './types';

export async function runCLI(
  source?: string,
  options: Partial<CLIOptions> = {}
) {
  const defaultOptions: CLIOptions = {
    format: 'mdx,md,json',
    output: 'docs',
    enableAI: false,
  };

  options = { ...defaultOptions, ...options };

  console.log(chalk.blue(`\n📄 AutoDocs: Generating documentation...\n`));

  if (!source || !options.format || !options.output) {
    const answers = await promptUserForOptions({ source, ...options });

    source = source || answers.source;
    options = { ...options, ...answers };
  }

  if (!source || !validateSource(source)) {
    console.log(chalk.red('🚨 Error: Invalid source directory.'));
    return;
  }

  if (!validateFormat(options.format ?? '')) {
    console.log(chalk.red(`🚨 Error: Invalid format "${options.format}".`));
    return;
  }

  if (!validateOutput(options.output)) {
    console.log(
      chalk.red(`🚨 Error: Invalid output directory "${options.output}".`)
    );
    return;
  }

  logMessage(`✅ Processing: ${chalk.bold(source)}`, 'green');
  logMessage(`🔹 Output format: ${chalk.bold(options.format)}`, 'cyan');
  logMessage(`📂 Saving to: ${chalk.bold(options.output)}`, 'magenta');
  logMessage(
    `🤖 AI Comments: ${chalk.bold(options.enableAI ? 'Enabled' : 'Disabled')}`,
    'yellow'
  );

  try {
    const components = directoryParser(source);

    console.log(chalk.green('\n✅ Parsing Completed Successfully!'));

    console.log(chalk.blue('\n📝 Generating Documentation...\n'));

    const formats = options.format ? options.format.split(',') : [];

    formats.forEach(async (format: string) => {
      let content = '';
      let fileName = `documentation.${format.trim()}`;

      switch (format.trim()) {
        case 'md':
        case 'mdx':
          content = await markdownGenerator(components);
          break;
        case 'json':
          content = await jsonGenerator(components);
          break;
        default:
          console.log(
            chalk.yellow(`⚠️ Unsupported format: ${format}, skipping...`)
          );
          return;
      }

      writeFile(options.output!, fileName, content);
    });

    console.log(chalk.green('\n✅ Documentation Generation Completed!'));
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error parsing directory: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    );
  }
}
