import chalk from 'chalk';
import { promptUserForOptions } from './interactive';
import { validateFormat, validateOutput, validateSource } from './validator';
import { parseDirectory } from './parser';
import { generateJSON, generateMarkdown } from './generator';
import { writeFile } from './helpers';

interface CLIOptions {
  format: string;
  output: string;
  enableAI: boolean;
}

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

  console.log(chalk.green(`✅ Processing: ${source}`));
  console.log(`🔹 Output format: ${options.format}`);
  console.log(`📂 Saving to: ${options.output}`);
  console.log(`🤖 AI Comments: ${options.enableAI ? 'Enabled' : 'Disabled'}`);

  console.log(chalk.blue('\n🚀 Starting Parsing Process...\n'));

  try {
    const components = parseDirectory(source);

    console.log(chalk.green('\n✅ Parsing Completed Successfully!'));

    console.log(chalk.blue('\n📝 Generating Documentation...\n'));

    const formats = options.format ? options.format.split(',') : [];

    formats.forEach((format: string) => {
      let content = '';
      let fileName = `documentation.${format.trim()}`;

      switch (format.trim()) {
        case 'md':
        case 'mdx':
          content = generateMarkdown(components);
          break;
        case 'json':
          content = generateJSON(components);
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
