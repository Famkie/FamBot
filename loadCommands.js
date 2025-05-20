import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import chalk from 'chalk';
import { pathToFileURL } from 'url';

export async function loadCommands(client, commandsDir) {
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.aliases = new Collection();

  const folders = fs.readdirSync(commandsDir);

  for (const folder of folders) {
    const folderPath = path.join(commandsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        const commandModule = await import(pathToFileURL(filePath).href);

        const command = commandModule.command || commandModule.default || {};
        const slashData = commandModule.data;

        const isPrefixCommand = typeof command.execute === 'function';
        const isSlashCommand = slashData && typeof commandModule.slash === 'function';

        if (isPrefixCommand && command.name) {
          client.commands.set(command.name, command);
          if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              client.aliases.set(alias, command.name);
            }
          }
          console.log(chalk.green(`[PREFIX] Loaded: ${command.name}`));
        }

        if (isSlashCommand) {
          client.slashCommands.set(slashData.name, {
            data: slashData,
            execute: commandModule.slash
          });
          console.log(chalk.cyan(`[SLASH] Loaded: ${slashData.name}`));
        }

        if (!isPrefixCommand && !isSlashCommand) {
          console.warn(chalk.yellow(`[WARN] Skipped invalid command file: ${file}`));
        }

      } catch (err) {
        console.error(chalk.red(`[ERROR] Gagal load command di ${file}:`), err);
      }
    }
  }
}
