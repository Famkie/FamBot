import { lottoManager } from '../../utils/lottoManager.js';

export async function executeSlashCommand(interaction) {
  const guildId = interaction.guild.id;
  const userId = interaction.user.id;

  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) return interaction.reply({ content: 'No active lotto.', ephemeral: true });
  if (!lotto.karma) return interaction.reply({ content: 'Karma entry is not enabled for this lotto.', ephemeral: true });
  if (lotto.entries.includes(userId)) return interaction.reply({ content: 'You already joined this lotto.', ephemeral: true });

  lotto.entries.push(userId);
  return interaction.reply({ content: 'You have joined the lotto via Karma!' });
}
