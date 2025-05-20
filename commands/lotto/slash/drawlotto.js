import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';
import { executePrefixCommand } from './drawlotto_prefix.js';

export const data = new SlashCommandBuilder()
  .setName('drawlotto')
  .setDescription('Draws the winner of the current lotto.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const aliases = ['draw', 'dl', 'drawl', 'drawlotto'];

async function execute(interaction, args = [], isSlash = false) {
  if (isSlash || interaction.isChatInputCommand?.()) {
    return executeSlashCommand(interaction);
  } else {
    return executePrefixCommand(interaction, args);
  }
}

async function executeSlashCommand(interaction) {
  const user = interaction.user;
  const guildId = interaction.guild.id;

  const lotto = lottoManager.getLotto(guildId);
  if (!lotto) {
    return interaction.reply({ content: '❌  Tidak ada lotto aktif.', ephemeral: true });
  }

  const isHost = lotto.host === user.id;
  const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);
  if (!isHost && !isAdmin) {
    return interaction.reply({ content: '❌  Hanya lotto runner atau admin yang bisa draw.', ephemeral: true });
  }

  if (lotto.entries.length === 0) {
    return interaction.reply('⚠️  Tidak ada peserta untuk diundi.');
  }

  const { winnerId } = lottoManager.drawWinner(guildId);
  lottoManager.endLotto(guildId);

  const winnerTag = `<@${winnerId}>`;
  const prizeText = lotto.prize.toLocaleString();

  return interaction.reply(`🎉 **DRAW COMPLETE!** Pemenang lotre ${prizeText} adalah ${winnerTag}! Selamat!!`);
}

export default {
  data,
  name: 'drawlotto',
  aliases,
  execute,
};
