import { logMessage } from './logger';
import figlet from 'figlet';

export async function printExitMessage() {
  logMessage('✅ Documentation process completed successfully!', 'green');
  logMessage('📂 Check your output directory for the generated files.', 'cyan');
  logMessage('🙏 Thank you for using Easydox!', 'blue');
  logMessage(
    '✨ Feel free to report issues or contribute on GitHub!',
    'magenta'
  );
  logMessage('----------------------------------------------------', 'gray');
  await delay(500);
  logMessage('👋 Exiting Easydox...\n', 'yellow');
}

export function printWelcomeMessage() {
  logMessage(
    figlet.textSync('Easydox', { horizontalLayout: 'default' }),
    'blue'
  );

  logMessage('----------------------------------------------------', 'gray');

  logMessage(
    '📄 Easydox: Your documentation, automated & simplified!\n',
    'blue'
  );

  logMessage('🚀 Preparing Easydox environment...\n', 'yellow');
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
