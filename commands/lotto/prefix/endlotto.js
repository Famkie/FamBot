import { lottoManager } from '../../utils/lottoManager.js';
import { PermissionFlagsBits } from 'discord.js';

export async function executePrefixCommand(message) {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return message.reply('You don’t have permission to end the lotto.');
  }

  const guildId = message.guild.id;
  const result = lottoManager.endLotto(guildId);

  if (!result.success) {
    return message.reply(result.message);
  }

  return message.channel.send('Lotto has been ended.');
}
