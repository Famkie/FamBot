import { lottoManager } from '../../utils/lottoManager.js';

const name = 'joinlotto';
const aliases = ['jl', 'join', 'jlotto'];

async function execute(ctx, client, args = []) {
  const user = ctx.author;
  const member = ctx.member;

  const lotto = lottoManager.getLotto(ctx.guild.id);
  if (!lotto) {
    return ctx.reply('No active lotto found.');
  }

  lotto.entries = lotto.entries || [];

  if (lotto.entries.includes(user.id)) {
    return ctx.reply('You already joined this lotto!');
  }

  if (lotto.faction && !member.roles.cache.some(role => role.name.toLowerCase().includes('faction'))) {
    return ctx.reply('This lotto is faction-only!');
  }

  if (lotto.karma && user.bot) {
    return ctx.reply('Bots can’t join a karma lotto.');
  }

  lotto.entries.push(user.id);

  const prizeFormatted = lotto.prize.toLocaleString('id-ID');
  return ctx.reply(`You're in! Good luck for the ${prizeFormatted} lotto!`);
}

export default {
  name,
  aliases,
  execute,
};
