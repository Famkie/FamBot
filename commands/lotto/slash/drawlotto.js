import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';

export const data = new SlashCommandBuilder()
  .setName('drawlotto')
  .setDescription('Draws the winner of the current lotto.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction) {
  const user = interaction.user;
  const guildId = interaction.guild.id;

  const lotto = lottoManager.getLotto(guildId);
  if (!lotto) {
    return interaction.reply({ content: '❌ Tidak ada lotto aktif.', ephemeral: true });
  }

  const isHost = lotto.host === user.id;
  const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);
  if (!isHost && !isAdmin) {
    return interaction.reply({ content: '❌ Hanya lotto runner atau admin yang bisa draw.', ephemeral: true });
  }

  if (!lotto.entries || lotto.entries.length === 0) {
    return interaction.reply({ content: '⚠️ Tidak ada peserta untuk diundi.', ephemeral: true });
  }

  const { winnerId } = lottoManager.drawWinner(guildId);
  lottoManager.endLotto(guildId);

  const winnerTag = `<@${winnerId}>`;
  const prizeText = lotto.prize.toLocaleString('id-ID');

  return interaction.reply(`🎉 **DRAW COMPLETE!** Pemenang lotre ${prizeText} adalah ${winnerTag}! Selamat!!`);
}

export default {
  data,
  name: 'drawlotto',
  execute,
};
