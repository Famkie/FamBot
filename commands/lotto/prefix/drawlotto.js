import { lottoManager } from '../../utils/lottoManager.js';
import { PermissionFlagsBits } from 'discord.js';

export async function executePrefixCommand(message, args = []) {
  const user = message.author;
  const guildId = message.guild.id;

  const lotto = lottoManager.getLotto(guildId);
  if (!lotto) {
    return message.reply('❌  Tidak ada lotto aktif.');
  }

  const isHost = lotto.host === user.id;
  const isAdmin = message.member.permissions.has(PermissionFlagsBits.ManageGuild);
  if (!isHost && !isAdmin) {
    return message.reply('❌  Hanya lotto runner atau admin yang bisa draw.');
  }

  if (lotto.entries.length === 0) {
    return message.reply('⚠️  Tidak ada peserta untuk diundi.');
  }

  const { winnerId } = lottoManager.drawWinner(guildId);
  lottoManager.endLotto(guildId);

  const winnerTag = `<@${winnerId}>`;
  const prizeText = lotto.prize.toLocaleString();

  return message.reply(`🎉 **DRAW COMPLETE!** Pemenang lotre ${prizeText} adalah ${winnerTag}! Selamat!!`);
}
