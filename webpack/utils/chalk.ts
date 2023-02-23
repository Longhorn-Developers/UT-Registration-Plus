import chalk from 'chalk';

export const error = chalk.bold.red;
export const { bold } = chalk;
export const info = chalk.bgHex('#673AB7').rgb(255, 255, 255);
export const warning = chalk.bgHex('#FF9800').rgb(255, 255, 255);
export const success = chalk.bgHex('#4CAF50').rgb(255, 255, 255);
