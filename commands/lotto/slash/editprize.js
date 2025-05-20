import { lottoManager } from '../../utils/lottoManager.js';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('editprize')
  .setDescription('Edit the prize of the current lotto.')
  .addStringOption(option =>
    option.setName('newprize')
      .setDescription('New prize value')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild); // Optional, depends on your permissions policy

export async function execute(interaction) {
  const guildId = interaction.guild.id;
  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) {
    return interaction.reply({ content: 'No active lotto.', ephemeral: true });
  }

  const userId = interaction.user.id;
  if (lotto.host !== userId && !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: 'Only the host or an admin can edit the prize.', ephemeral: true });
  }

  const newPrize = interaction.options.getString('newprize');

  // Optional: tambah validasi format newPrize jika perlu
  if (!newPrize || newPrize.trim() === '') {
    return interaction.reply({ content: 'Invalid prize value.', ephemeral: true });
  }

  lotto.prize = newPrize;

  return interaction.reply(`Prize has been updated to: **${newPrize}**`);
}
