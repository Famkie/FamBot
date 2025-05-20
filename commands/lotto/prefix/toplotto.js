import { EmbedBuilder } from 'discord.js';
import { lottoStatsManager } from '../../utils/lottoStatsManager.js';
import { lottoLeaderboard } from '../../utils/lottoLeaderboard.js';

export async function executePrefixCommand(message, client, args) {
  const type = args[0]?.toLowerCase() === 'karma' ? 'karma' : 'lotto';
  const guildId = message.guild.id;

  const embed = new EmbedBuilder()
    .setTitle(`Top 5 ${type === 'karma' ? 'Karma' : 'Lotto Winners'}`)
    .setColor('#FFD700');

  if (type === 'karma') {
    const karmaMap = lottoStatsManager.getKarma(guildId);
    if (!karmaMap || karmaMap.size === 0) {
      embed.setDescription('No karma data found.');
    } else {
      const sorted = [...karmaMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      let description = '';
      for (let i = 0; i < sorted.length; i++) {
        const [userId, karma] = sorted[i];
        const user = await client.users.fetch(userId).catch(() => null);
        description += `**${i + 1}.** ${user ? user.tag : 'Unknown User'} — ${karma} karma\n`;
      }
      embed.setDescription(description);
    }
  } else {
    const winners = lottoLeaderboard.getTopWinners(guildId, 5);
    if (!winners.length) {
      embed.setDescription('No lotto winner data found.');
    } else {
      let description = '';
      for (let i = 0; i < winners.length; i++) {
        const [userId, wins] = winners[i];
        const user = await client.users.fetch(userId).catch(() => null);
        description += `**${i + 1}.** ${user ? user.tag : 'Unknown User'} — ${wins} wins\n`;
      }
      embed.setDescription(description);
    }
  }

  await message.channel.send({ embeds: [embed] });
}
