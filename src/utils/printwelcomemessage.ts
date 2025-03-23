import figlet from 'figlet';
import { logMessage } from './logger';
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
