import { lottoManager } from '../../utils/lottoManager.js';

export async function executeSlashCommand(interaction) {
  const lotto = lottoManager.getLotto(interaction.guild.id);

  if (!lotto) {
    return interaction.reply({ content: 'No active lotto in this server.', ephemeral: true });
  }

  const embed = {
    color: 0x00bfff,
    title: 'Active Lotto Info',
    fields: [
      { name: 'Host', value: `<@${lotto.host}>`, inline: true },
      { name: 'Prize', value: lotto.prize.toString(), inline: true },
      { name: 'Base', value: lotto.base.toString(), inline: true },
      { name: 'Added', value: lotto.added.toString(), inline: true },
      { name: 'Karma Mode', value: lotto.karma ? 'Enabled' : 'Disabled', inline: true },
      { name: 'Faction Mode', value: lotto.faction ? 'Enabled' : 'Disabled', inline: true },
      { name: 'Participants', value: `${lotto.entries.length} users`, inline: true },
      { name: 'Created At', value: `<t:${Math.floor(lotto.createdAt / 1000)}:F>`, inline: false },
    ],
  };

  return interaction.reply({ embeds: [embed] });
}
