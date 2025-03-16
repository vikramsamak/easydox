import inquirer from 'inquirer';

export interface CLIOptions {
  source?: string;
  format?: string;
  output?: string;
}

export async function promptUserForOptions(
  existingOptions: CLIOptions
): Promise<CLIOptions> {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'source',
      message: 'Enter the source directory:',
      when: !existingOptions.source,
    },
    {
      type: 'input',
      name: 'format',
      message: 'Choose output formats (mdx, md, json):',
      default: existingOptions.format || 'mdx,md,json',
    },
    {
      type: 'input',
      name: 'output',
      message: 'Enter output directory:',
      default: existingOptions.output || 'docs',
    },
  ]);
}
