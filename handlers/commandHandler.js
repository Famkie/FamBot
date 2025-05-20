import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();

const prefix = '!';

export class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();       // Map commandName => command module
    this.slashCommands = [];         // Array command data untuk deploy slash command
  }

  async loadCommands(dir = path.resolve('./src/commands')) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        // Rekursif masuk folder
        await this.loadCommands(path.join(dir, file.name));
      } else if (file.name.endsWith('.js')) {
        try {
          const cmdPath = path.join(dir, file.name);
          const cmdModule = await import(`file://${cmdPath}`);
          const command = cmdModule.default;

          if (!command?.data || !command?.execute) {
            console.warn(`[WARN] Command file ${file.name} missing "data" or "execute" export.`);
            continue;
          }

          this.commands.set(command.data.name, command);
          this.slashCommands.push(command.data);
          console.log(`[INFO] Loaded command: ${command.data.name}`);

        } catch (err) {
          console.error(`[ERROR] Failed loading command ${file.name}:`, err);
        }
      }
    }
  }

  async deploySlashCommands() {
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    try {
      console.log('[INFO] Started refreshing slash commands.');

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.CLIENT_GUILD),
        { body: this.slashCommands }
      );

      console.log('[INFO] Successfully reloaded slash commands.');
    } catch (error) {
      console.error('[ERROR] Failed to reload slash commands:', error);
    }
  }

  async handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const command = this.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, this.client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
      }
    }
  }

  async handleMessage(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = this.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, this.client, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing this command!');
    }
  }
}
