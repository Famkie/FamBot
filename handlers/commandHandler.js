import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import chalk from 'chalk';
import { pathToFileURL } from 'url';

export async function loadCommands(client, commandsDir) {
  client.commands = new Collection();
  client.aliases = new Collection();
  client.slashCommands = [];

  const commandFolders = fs.readdirSync(commandsDir);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    const mergedCommand = {};

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const commandModule = await import(pathToFileURL(filePath).href);

      if (file.includes('_prefix')) {
        Object.assign(mergedCommand, commandModule.command);
      } else if (file.includes('_slash')) {
        if (commandModule.command) mergedCommand.slash = commandModule.command.slash;
        if (commandModule.data) mergedCommand.data = commandModule.data;
      } else {
        // fallback for merged or general file like `top.js`
        Object.assign(mergedCommand, commandModule.command || commandModule.default);
        if (commandModule.data) mergedCommand.data = commandModule.data;
      }
    }

    if (!mergedCommand.name || (!mergedCommand.execute && !mergedCommand.slash)) {
      console.warn(chalk.yellow(`[WARN] Invalid command in folder: ${folder}`));
      continue;
    }

    // Register command
    client.commands.set(mergedCommand.name, mergedCommand);

    if (Array.isArray(mergedCommand.aliases)) {
      for (const alias of mergedCommand.aliases) {
        client.aliases.set(alias, mergedCommand.name);
      }
    }

    if (mergedCommand.data) {
      client.slashCommands.push(mergedCommand.data.toJSON?.() || mergedCommand.data);
    }

    console.log(chalk.green(`[INFO] Loaded command: ${mergedCommand.name}`));
  }
}

export async function deploySlashCommands(clientId, guildId, slashCommands, token) {
  const { REST } = await import('@discordjs/rest');
  const { Routes } = await import('discord-api-types/v9');

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
}

export async function handleInteraction(interaction, client) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (typeof command.slash === 'function') {
      await command.slash(interaction, client);
    } else if (typeof command.execute === 'function') {
      await command.execute(interaction, client);
    } else {
      throw new Error('No valid slash handler found.');
    }
  } catch (error) {
    console.error(chalk.red(`[ERROR] Failed to execute /${interaction.commandName}:`), error);
    const replyPayload = { content: 'Terjadi error saat mengeksekusi command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyPayload);
    } else {
      await interaction.reply(replyPayload);
    }
  }
}

export async function handleMessage(message, client, prefix = '!') {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const cmdName = client.commands.has(commandName)
    ? commandName
    : client.aliases.get(commandName);

  if (!cmdName) return;

  const command = client.commands.get(cmdName);
  if (!command || typeof command.execute !== 'function') return;

  try {
    await command.execute(message, client, args);
  } catch (error) {
    console.error(chalk.red(`[ERROR] Failed to execute !${cmdName}:`), error);
    message.reply('Terjadi error saat mengeksekusi command.');
  }
}
