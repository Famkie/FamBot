import { lottoStatsManager } from '../../utils/lottoStatsManager.js';

export async function executePrefixCommand(message) {
  const guildId = message.guild.id;
  const leaderboard = lottoStatsManager.getLeaderboard(guildId);

  if (!leaderboard || leaderboard.length === 0) {
    return message.reply('No data available for leaderboard.');
  }

  let reply = '**Lotto Leaderboard**\n';
  leaderboard.slice(0, 10).forEach((entry, idx) => {
    reply += `\`${idx + 1}.\` <@${entry.userId}> - Wins: **${entry.wins}**, Entries: **${entry.entries}**\n`;
  });

  return message.reply(reply);
}
