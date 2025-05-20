import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  // Slash command
  async execute(interaction) {
    if (interaction.isCommand()) {
      await interaction.reply('Pong!');
    }
  },

  // Prefix command
  async execute(message, client, args) {
    if (message.content.startsWith('!ping')) {
      await message.channel.send('Pong!');
    }
  }
};
