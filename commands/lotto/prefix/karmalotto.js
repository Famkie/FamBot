import { lottoManager } from '../../utils/lottoManager.js';

export async function executePrefixCommand(message) {
  const guildId = message.guild.id;
  const userId = message.author.id;

  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) return message.reply('No active lotto.');
  if (!lotto.karma) return message.reply('Karma entry is not enabled for this lotto.');
  if (lotto.entries.includes(userId)) return message.reply('You already joined this lotto.');

  lotto.entries.push(userId);
  return message.reply('You have joined the lotto via Karma!');
}
