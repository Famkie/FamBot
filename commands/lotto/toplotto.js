import { lottoLeaderboard } from '../../utils/lottoLeaderboard.js';
import { lottoStatsManager } from '../../utils/lottoStatsManager.js';
import { EmbedBuilder } from 'discord.js';

export const data = {
  name: 'top',
  description: 'Displays the top 5 members by total lottery value or karma.',
  options: [
    {
      name: 'type',
      description: 'Type of leaderboard to display',
      type: 3, // STRING
      required: false,
      choices: [
        { name: 'lotto', value: 'lotto' },
        { name: 'karma', value: 'karma' },
      ],
    },
  ],
};

export async function execute(interaction, client) {
  const type = interaction.options?.getString('type') || 'lotto';
  const guildId = interaction.guildId;

  let embed = new EmbedBuilder()
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
    if (winners.length === 0) {
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

  if (interaction.isCommand()) {
    await interaction.reply({ embeds: [embed] });
  } else {
    // Prefix commands, interaction is message
    await interaction.channel.send({ embeds: [embed] });
  }
}
