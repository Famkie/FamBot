import { lottoManager } from '../../utils/lottoManager.js';
import { PermissionFlagsBits } from 'discord.js';

export async function executePrefixCommand(message, args) {
  const guildId = message.guild.id;
  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) return message.reply('❌ Tidak ada lotto aktif.');

  const authorId = message.author.id;
  if (lotto.host !== authorId && !message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return message.reply('❌ Hanya host atau admin yang bisa mengubah hadiah.');
  }

  const newPrize = args.join(' ').trim();
  if (!newPrize) return message.reply('⚠️ Mohon sertakan hadiah baru.');

  lotto.prize = newPrize;
  return message.reply(`✅ Hadiah berhasil diubah menjadi: **${newPrize}**`);
}
