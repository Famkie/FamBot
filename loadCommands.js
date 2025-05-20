import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import { pathToFileURL } from 'url';

export async function loadCommands(client, commandsDir) {
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.aliases = new Collection();

  const folders = fs.readdirSync(commandsDir);

  for (const folder of folders) {
    const folderPath = path.join(commandsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const commandModule = await import(pathToFileURL(filePath).href);

        const command = commandModule.command || commandModule.default || {};
        const slashData = commandModule.data;

        if (command.name && typeof command.execute === 'function') {
          client.commands.set(command.name, command);
          if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              client.aliases.set(alias, command.name);
            }
          }
          console.log(`[PREFIX] Loaded: ${command.name}`);
        }

        if (slashData && slashData.name) {
          client.slashCommands.set(slashData.name, {
            data: slashData,
            execute: command.slash,
          });
          console.log(`[SLASH] Loaded: ${slashData.name}`);
        }
      } catch (err) {
        console.error(`Failed to load command ${file}:`, err);
      }
    }
  }
}
