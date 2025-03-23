import chalk from 'chalk';
import { logMessage, printWelcomeMessage, promptUserForOptions } from './utils';
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
  };

  options = { ...defaultOptions, ...options };

  printWelcomeMessage();

  if (!source || !options.format || !options.output) {
    const answers = await promptUserForOptions({ source, ...options });

    source = source || answers.source;
    options = { ...options, ...answers };
  }

  if (!source || !validateSource(source)) {
    logMessage('🚨 Error: Invalid source directory.', 'red');
    return;
  }

  if (!validateFormat(options.format ?? '')) {
    logMessage(`🚨 Error: Invalid format "${options.format}".`, 'red');
    return;
  }

  if (!validateOutput(options.output)) {
    logMessage(
      `🚨 Error: Invalid output directory "${options.output}".`,
      'red'
    );
    return;
  }

  logMessage(`✅ Processing: ${chalk.bold(source)}`, 'green');
  logMessage(`🔹 Output format: ${chalk.bold(options.format)}`, 'cyan');
  logMessage(`📂 Saving to: ${chalk.bold(options.output)}`, 'magenta');

  try {
    const components = directoryParser(source);

    logMessage(`✅ Parsing Completed Successfully!`, 'green');

    logMessage(`📝 Generating Documentation...`, 'blue');

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
          logMessage(`⚠️ Unsupported format: ${format}, skipping...`, 'yellow');
          return;
      }

      writeFile(options.output!, fileName, content);
    });

    logMessage(`✅ Documentation Generation Completed!`, 'green');
  } catch (error) {
    logMessage(
      `❌ Error parsing directory: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'red'
    );
  }
}
