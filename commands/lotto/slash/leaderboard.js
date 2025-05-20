import { lottoStatsManager } from '../../utils/lottoStatsManager.js';

export async function executeSlashCommand(interaction) {
  const guildId = interaction.guild.id;
  const leaderboard = lottoStatsManager.getLeaderboard(guildId);

  if (!leaderboard || leaderboard.length === 0) {
    return interaction.reply({ content: 'No data available for leaderboard.', ephemeral: true });
  }

  let reply = '**Lotto Leaderboard**\n';
  leaderboard.slice(0, 10).forEach((entry, idx) => {
    reply += `\`${idx + 1}.\` <@${entry.userId}> - Wins: **${entry.wins}**, Entries: **${entry.entries}**\n`;
  });

  return interaction.reply(reply);
}
