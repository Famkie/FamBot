import config from '../config/config.js';

const prefix = config.prefix || '!';

export default {
  name: 'messageCreate',

  async execute(message, client) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const actualCommandName = client.commands.has(commandName)
      ? commandName
      : client.aliases.get(commandName);

    if (!actualCommandName) return;

    const command = client.commands.get(actualCommandName);

    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      await message.reply('Terjadi error saat menjalankan command.');
    }
  }
};
