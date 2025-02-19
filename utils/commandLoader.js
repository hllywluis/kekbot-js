import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export async function loadCommands(commandsPath, logger) {
  const commands = [];
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  await Promise.all(
    commandFiles.map(async file => {
      try {
        const filePath = join(commandsPath, file);
        const commandModule = await import(filePath);
        const command = commandModule.default;

        if (!command?.data || !command?.execute) {
          logger.warn(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
          return;
        }

        commands.push(command);
        logger.log(`Loaded command: ${command.data.name}`);
      } catch (error) {
        logger.error(`Error loading command from ${file}:`, error);
      }
    })
  );

  return commands;
}
