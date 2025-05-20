import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { pathToFileURL } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const prefix = '!';

export class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();       // commandName or alias => command object
    this.slashCommands = [];         // list of slash command data for deploy
  }

  async loadCommands(dir = path.resolve('./src/commands')) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await this.loadCommands(path.join(dir, file.name));
      } else if (file.name.endsWith('.js')) {
        try {
          const cmdPath = path.join(dir, file.name);
          const cmdModule = await import(pathToFileURL(cmdPath).href);
          const command = cmdModule.default;

          if (!command?.data || !command?.execute) {
            console.warn(chalk.yellow(`[WARN] Skipped invalid command file: ${file.name}`));
            continue;
          }

          // Simpan command utama
          this.commands.set(command.data.name, command);

          // Simpan alias jika ada
          if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              this.commands.set(alias, command);
            }
          }

          // Tambahkan ke slash deploy jika belum ada
          if (!this.slashCommands.some(cmd => cmd.name === command.data.name)) {
            this.slashCommands.push(command.data);
          }

          console.log(chalk.green(`[INFO] Loaded command: ${command.data.name}`));
        } catch (err) {
          console.error(chalk.red(`[ERROR] Failed to load command ${file.name}:`), err);
        }
      }
    }
  }

  async deploySlashCommands() {
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    try {
      console.log(chalk.blue('[INFO] Deploying slash commands...'));

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.CLIENT_GUILD),
        { body: this.slashCommands }
      );

      console.log(chalk.green('[INFO] Slash commands deployed successfully!'));
    } catch (error) {
      console.error(chalk.red('[ERROR] Slash command deployment failed:'), error);
    }
  }

  async handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const command = this.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, this.client);
    } catch (error) {
      console.error(chalk.red(`[ERROR] Failed to execute /${interaction.commandName}`), error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Terjadi error saat mengeksekusi command.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Terjadi error saat mengeksekusi command.', ephemeral: true });
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
      console.error(chalk.red(`[ERROR] Failed to execute !${commandName}`), error);
      message.reply('Terjadi error saat mengeksekusi command.');
    }
  }
}
