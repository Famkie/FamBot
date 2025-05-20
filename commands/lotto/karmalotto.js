import { SlashCommandBuilder } from 'discord.js';
import { lottoManager } from '../../lib/lottoManager.js';

export const data = new SlashCommandBuilder()
  .setName('karma')
  .setDescription('Join the active lotto via Karma (if enabled).');

export const command = {
  name: 'karma',
  aliases: ['karma'],
  description: 'Join the lotto via Karma (free entry if allowed)',

  async execute(message) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    const lotto = lottoManager.getLotto(guildId);

    if (!lotto) return message.reply('No active lotto.');
    if (!lotto.karma) return message.reply('Karma entry is not enabled for this lotto.');
    if (lotto.entries.includes(userId)) return message.reply('You already joined this lotto.');

    lotto.entries.push(userId);
    return message.reply('You have joined the lotto via Karma!');
  },

  async slash(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const lotto = lottoManager.getLotto(guildId);

    if (!lotto) return interaction.reply({ content: 'No active lotto.', ephemeral: true });
    if (!lotto.karma) return interaction.reply({ content: 'Karma entry is not enabled for this lotto.', ephemeral: true });
    if (lotto.entries.includes(userId)) return interaction.reply({ content: 'You already joined this lotto.', ephemeral: true });

    lotto.entries.push(userId);
    return interaction.reply({ content: 'You have joined the lotto via Karma!' });
  },
};
