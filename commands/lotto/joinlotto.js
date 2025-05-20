import { SlashCommandBuilder } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';

const data = new SlashCommandBuilder()
  .setName('joinlotto')
  .setDescription('Join the currently active lotto.');

const aliases = ['join', 'jl', 'jlk', 'jla', 'jlf', 'jlkf'];

async function execute(interaction, args, isSlash = false) {
  const user = isSlash ? interaction.user : interaction.author;
  const member = isSlash ? interaction.member : interaction.member;

  const lotto = lottoManager.getLotto(interaction.guild.id);
  if (!lotto) {
    const msg = 'No active lotto found.';
    return isSlash ? interaction.reply({ content: msg, ephemeral: true }) : interaction.reply(msg);
  }

  // Prevent duplicate joins
  if (lotto.entries.includes(user.id)) {
    const msg = 'You already joined this lotto!';
    return isSlash ? interaction.reply({ content: msg, ephemeral: true }) : interaction.reply(msg);
  }

  // Faction-only rule check (dummy check, replace with Torn API or Discord roles)
  if (lotto.faction && !member.roles.cache.some(role => role.name.toLowerCase().includes('faction'))) {
    const msg = 'This lotto is faction-only!';
    return isSlash ? interaction.reply({ content: msg, ephemeral: true }) : interaction.reply(msg);
  }

  // Karma rule simulation (dummy)
  if (lotto.karma && user.bot) {
    const msg = 'Bots can’t join a karma lotto.';
    return isSlash ? interaction.reply({ content: msg, ephemeral: true }) : interaction.reply(msg);
  }

  lotto.entries.push(user.id);
  const reply = `You're in! Good luck for the ${lotto.prize.toLocaleString()} lotto!`;

  return isSlash ? interaction.reply(reply) : interaction.reply(reply);
}

export default {
  data,
  name: 'joinlotto',
  aliases,
  execute,
};
