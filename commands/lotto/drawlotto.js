import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';

const data = new SlashCommandBuilder()
  .setName('drawlotto')
  .setDescription('Draws the winner of the current lotto.')
  // Batasi cuma orang yang punya “Manage Guild” (opsional)
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const aliases = ['draw', 'dl', 'drawl', 'drawlotto'];

async function execute(interaction, args, isSlash = false) {
  const user = isSlash ? interaction.user : interaction.author;
  const guildId = interaction.guild.id;

  const lotto = lottoManager.getLotto(guildId);
  if (!lotto) {
    const msg = '❌  Tidak ada lotto aktif.';
    return isSlash
      ? interaction.reply({ content: msg, ephemeral: true })
      : interaction.reply(msg);
  }

  // Hanya runner atau admin boleh draw
  const isHost = lotto.host === user.id;
  const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);
  if (!isHost && !isAdmin) {
    const msg = '❌  Hanya lotto runner atau admin yang bisa draw.';
    return isSlash
      ? interaction.reply({ content: msg, ephemeral: true })
      : interaction.reply(msg);
  }

  // Harus ada peserta
  if (lotto.entries.length === 0) {
    const msg = '⚠️  Tidak ada peserta untuk diundi.';
    return isSlash ? interaction.reply(msg) : interaction.reply(msg);
  }

  // Draw!
  const { winnerId } = lottoManager.drawWinner(guildId);

  // Akhiri lotto; hapus dari map
  lottoManager.endLotto(guildId);

  const winnerTag = `<@${winnerId}>`;
  const prizeText = lotto.prize.toLocaleString();

  const reply = `🎉 **DRAW COMPLETE!** Pemenang lotre ${prizeText} adalah ${winnerTag}! Selamat!!`;
  return isSlash ? interaction.reply(reply) : interaction.reply(reply);
}

export default {
  data,
  name: 'drawlotto',
  aliases,
  execute,
};
