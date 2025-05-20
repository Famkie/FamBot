import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { lottoManager } from '../../lib/lottoManager.js';

export const data = new SlashCommandBuilder()
  .setName('end')
  .setDescription('End the currently active lotto.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const command = {
  name: 'end',
  aliases: ['end'],
  description: 'End the currently active lotto.',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('You don’t have permission to end the lotto.');
    }

    const guildId = message.guild.id;
    const result = lottoManager.endLotto(guildId);

    if (!result.success) {
      return message.reply(result.message);
    }

    return message.channel.send('Lotto has been ended.');
  },

  async slash(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: 'You don’t have permission to end the lotto.', ephemeral: true });
    }

    const guildId = interaction.guild.id;
    const result = lottoManager.endLotto(guildId);

    if (!result.success) {
      return interaction.reply({ content: result.message, ephemeral: true });
    }

    return interaction.reply('Lotto has been ended.');
  },
};
