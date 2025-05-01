import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Asynchronously loads all command modules from a directory
 * @async
 * @param {string} commandsPath - Path to the commands directory
 * @param {Logger} logger - Logger instance for logging loading progress
 * @returns {Promise<Array<Object>>} Array of command objects with:
 * @property {SlashCommandBuilder} data - Command definition
 * @property {Function} execute - Command execution function
 * @throws {TypeError} If commandsPath is not a string
 * @example
 * // Load all commands from './commands'
 * const commands = await loadCommands('./commands', logger);
 */
export async function loadCommands(commandsPath, logger) {
  const commands = [];
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  await Promise.all(
    commandFiles.map(async file => {
      try {
        const filePath = join(commandsPath, file);
        const commandModule = await import(filePath);
        const Command = commandModule.default;

        const CommandBase = (await import('./command.js')).default;
        if (Command.prototype instanceof CommandBase) {
          // New style - class extending Command
          const commandInstance = new Command();
          // Wrap run() in execute() for backward compatibility
          commandInstance.execute = commandInstance.run.bind(commandInstance);
          commands.push(commandInstance);
          logger.log(`Loaded command: ${commandInstance.data.name}`);
        } else if (Command?.data && Command?.execute) {
          // Old style - plain object (maintain backward compatibility)
          commands.push(Command);
          logger.log(`Loaded command: ${Command.data.name}`);
        } else {
          logger.warn(`[WARNING] The command at ${filePath} is missing required properties.`);
          return;
        }
      } catch (error) {
        logger.error(`Error loading command from ${file}: ${error.stack}`);
      }
    }),
  );

  return commands;
}
