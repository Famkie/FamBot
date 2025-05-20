import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import chalk from 'chalk';
import { pathToFileURL } from 'url';

export async function loadCommands(client, commandsDir) {
  client.commands = new Collection();
  client.aliases = new Collection();

  const commandFolders = fs.readdirSync(commandsDir);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const commandModule = await import(pathToFileURL(filePath).href);
        const command = commandModule.default;

        if (!command || !command.name || !command.execute) {
          console.warn(chalk.yellow(`[WARN] Invalid command in file: ${file}`));
          continue;
        }

        // Simpan command utama
        client.commands.set(command.name, command);

        // Simpan alias jika ada
        if (Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            client.aliases.set(alias, command.name);
          }
        }

        console.log(chalk.green(`[INFO] Loaded command: ${command.name}`));
      } catch (error) {
        console.error(chalk.red(`[ERROR] Failed to load command ${file}:`), error);
      }
    }
  }
}

export async function deploySlashCommands(clientId, guildId, slashCommands, token) {
  import('@discordjs/rest').then(({ REST }) => {
    import('discord-api-types/v9').then(async ({ Routes }) => {
      const rest = new REST({ version: '9' }).setToken(token);

      try {
        console.log(chalk.blue('[INFO] Deploying slash commands...'));
        await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: slashCommands }
        );
        console.log(chalk.green('[INFO] Slash commands deployed successfully!'));
      } catch (error) {
        console.error(chalk.red('[ERROR] Slash command deployment failed:'), error);
      }
    });
  });
}

export async function handleInteraction(interaction, client) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(chalk.red(`[ERROR] Failed to execute /${interaction.commandName}:`), error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Terjadi error saat mengeksekusi command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Terjadi error saat mengeksekusi command.', ephemeral: true });
    }
  }
}

export async function handleMessage(message, client, prefix = '!') {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  // cari command dari nama atau alias
  const cmdName = client.commands.has(commandName) 
    ? commandName 
    : client.aliases.get(commandName);

  if (!cmdName) return;

  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, client, args);
  } catch (error) {
    console.error(chalk.red(`[ERROR] Failed to execute !${cmdName}:`), error);
    message.reply('Terjadi error saat mengeksekusi command.');
  }
}
