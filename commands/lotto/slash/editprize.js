import { lottoManager } from '../../utils/lottoManager.js';
import { PermissionFlagsBits } from 'discord.js';

export async function executeSlashCommand(interaction) {
  const guildId = interaction.guild.id;
  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) {
    return interaction.reply({ content: 'No active lotto.', ephemeral: true });
  }

  const userId = interaction.user.id;
  if (lotto.host !== userId && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: 'Only the host or an admin can edit the prize.', ephemeral: true });
  }

  const newPrize = interaction.options.getString('newprize');
  lotto.prize = newPrize;

  return interaction.reply(`Prize has been updated to: **${newPrize}**`);
}
