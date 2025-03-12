import chalk from 'chalk';
import { ChalkColors } from '../types';

export function logMessage(
  message: string,
  color: ChalkColors,
  newLine = true
) {
  const coloredMessage = chalk[color](message);
  console.log(newLine ? `\n${coloredMessage}\n` : coloredMessage);
}
