import { lottoManager } from '../../utils/lottoManager.js';

export async function executePrefixCommand(message, args = []) {
  const user = message.author;
  const member = message.member;

  const lotto = lottoManager.getLotto(message.guild.id);
  if (!lotto) {
    return message.reply('No active lotto found.');
  }

  lotto.entries = lotto.entries || [];

  if (lotto.entries.includes(user.id)) {
    return message.reply('You already joined this lotto!');
  }

  if (lotto.faction && !member.roles.cache.some(role => role.name.toLowerCase().includes('faction'))) {
    return message.reply('This lotto is faction-only!');
  }

  if (lotto.karma && user.bot) {
    return message.reply('Bots can’t join a karma lotto.');
  }

  lotto.entries.push(user.id);

  const prizeFormatted = lotto.prize.toLocaleString('id-ID');
  return message.reply(`You're in! Good luck for the ${prizeFormatted} lotto!`);
}
