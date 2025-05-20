import { lottoManager } from '../../utils/lottoManager.js';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('endlotto')
  .setDescription('Mengakhiri undian yang sedang berjalan.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: '❌ Kamu tidak memiliki izin untuk mengakhiri lotto.', ephemeral: true });
  }

  const guildId = interaction.guild.id;
  const result = lottoManager.endLotto(guildId);

  if (!result.success) {
    return interaction.reply({ content: `⚠️ ${result.message}`, ephemeral: true });
  }

  return interaction.reply('✅ Lotto telah diakhiri.');
}

export default {
  data,
  name: 'endlotto',
  aliases: ['stoplotto', 'closelotto'],
  execute,
};
