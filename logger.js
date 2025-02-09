import chalk from 'chalk';

class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  log(message) {
    console.log(`${chalk.blue('📝')} ${chalk.blue(`[${this.moduleName}]`)} ${message}`);
  }

  error(message) {
    console.error(`${chalk.red('❌')} ${chalk.red(`[${this.moduleName}]`)} ${message}`);
  }

  warn(message) {
    console.warn(`${chalk.yellow('⚠️')} ${chalk.yellow(`[${this.moduleName}]`)} ${message}`);
  }

  info(message) {
    console.info(`${chalk.green('ℹ️')} ${chalk.green(`[${this.moduleName}]`)} ${message}`);
  }

  debug(message) {
    console.debug(`${chalk.gray('🔧')} ${chalk.gray(`[${this.moduleName}]`)} ${message}`);
  }
}

export default Logger;
