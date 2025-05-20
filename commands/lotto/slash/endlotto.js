import { lottoManager } from '../../utils/lottoManager.js';
import { PermissionFlagsBits } from 'discord.js';

export async function executeSlashCommand(interaction) {
  if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: 'You don’t have permission to end the lotto.', ephemeral: true });
  }

  const guildId = interaction.guild.id;
  const result = lottoManager.endLotto(guildId);

  if (!result.success) {
    return interaction.reply({ content: result.message, ephemeral: true });
  }

  return interaction.reply('Lotto has been ended.');
}
