import chalk from 'chalk';

/**
 * Enhanced logger utility with timestamps and consistent formatting
 */
class Logger {
  /**
   * Create a new Logger instance
   * @param {string} moduleName - Name of the module for context
   */
  constructor(moduleName) {
    if (typeof moduleName !== 'string') {
      throw new Error('Logger requires a string moduleName');
    }
    this.moduleName = moduleName;
  }

  /**
   * Get formatted timestamp
   * @private
   */
  #getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message with consistent structure
   * @private
   * @param {string} emoji - Log level emoji
   * @param {string} level - Log level name
   * @param {string} message - Message to log
   */
  #formatMessage(emoji, level, message) {
    const timestamp = this.#getTimestamp();
    return `${chalk.gray(timestamp)} ${emoji} ${chalk.cyan(`[${this.moduleName}]`)} ${level}: ${message}`;
  }

  /**
   * Log informational message
   * @param {string} message - Message to log
   */
  log(message) {
    console.log(this.#formatMessage(chalk.blue('📝'), 'LOG', message));
  }

  /**
   * Log error message
   * @param {string|Error} message - Error message or Error object
   */
  error(message) {
    const msg = message instanceof Error ? message.stack || message.message : message;
    console.error(this.#formatMessage(chalk.red('❌'), 'ERROR', msg));
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   */
  warn(message) {
    console.warn(this.#formatMessage(chalk.yellow('⚠️'), 'WARN', message));
  }

  /**
   * Log info message
   * @param {string} message - Info message
   */
  info(message) {
    console.info(this.#formatMessage(chalk.green('ℹ️'), 'INFO', message));
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   */
  debug(message) {
    console.debug(this.#formatMessage(chalk.gray('🔧'), 'DEBUG', message));
  }
}

export default Logger;
