import { lottoStatsManager } from '../../utils/lottoStatsManager.js';

async function execute(message) {
  const guildId = message.guild.id;
  const leaderboard = lottoStatsManager.getLeaderboard(guildId);

  if (!leaderboard || leaderboard.length === 0) {
    return message.reply('Tidak ada data leaderboard.');
  }

  let reply = '**🏆 Lotto Leaderboard**\n';
  leaderboard.slice(0, 10).forEach((entry, idx) => {
    reply += `\`${idx + 1}.\` <@${entry.userId}> - Menang: **${entry.wins}**, Ikut: **${entry.entries}**\n`;
  });

  return message.reply(reply);
}

export const command = {
  name: 'leaderboard',
  aliases: ['toplotto', 'toplottery', 'lottolead'],
  description: 'Tampilkan leaderboard lotto (prefix only)',
  execute,
};
