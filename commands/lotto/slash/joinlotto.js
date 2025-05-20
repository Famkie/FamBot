import { SlashCommandBuilder } from 'discord.js';
import { executePrefixCommand } from './joinlotto_prefix.js';

export const data = new SlashCommandBuilder()
  .setName('joinlotto')
  .setDescription('Join the currently active lotto.');

const aliases = ['join', 'jl', 'jlk', 'jla', 'jlf', 'jlkf'];

async function execute(interaction, args = [], isSlash = false) {
  if (isSlash || interaction.isChatInputCommand?.()) {
    return executeSlashCommand(interaction);
  } else {
    return executePrefixCommand(interaction, args);
  }
}

async function executeSlashCommand(interaction) {
  const user = interaction.user;
  const member = interaction.member;

  const lotto = lottoManager.getLotto(interaction.guild.id);
  if (!lotto) {
    return interaction.reply({ content: 'No active lotto found.', ephemeral: true });
  }

  lotto.entries = lotto.entries || [];

  if (lotto.entries.includes(user.id)) {
    return interaction.reply({ content: 'You already joined this lotto!', ephemeral: true });
  }

  if (lotto.faction && !member.roles.cache.some(role => role.name.toLowerCase().includes('faction'))) {
    return interaction.reply({ content: 'This lotto is faction-only!', ephemeral: true });
  }

  if (lotto.karma && user.bot) {
    return interaction.reply({ content: 'Bots can’t join a karma lotto.', ephemeral: true });
  }

  lotto.entries.push(user.id);

  const prizeFormatted = lotto.prize.toLocaleString('id-ID');
  return interaction.reply(`You're in! Good luck for the ${prizeFormatted} lotto!`);
}

export default {
  data,
  name: 'joinlotto',
  aliases,
  execute,
};
