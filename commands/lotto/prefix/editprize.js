import { lottoManager } from '../../utils/lottoManager.js';
import { PermissionFlagsBits } from 'discord.js';

export async function executePrefixCommand(message, args) {
  const guildId = message.guild.id;
  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) return message.reply('No active lotto.');

  const authorId = message.author.id;
  if (lotto.host !== authorId && !message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return message.reply('Only the host or an admin can edit the prize.');
  }

  const newPrize = args.join(' ');
  if (!newPrize) return message.reply('Please provide a new prize.');

  lotto.prize = newPrize;
  return message.reply(`Prize has been updated to: **${newPrize}**`);
}
