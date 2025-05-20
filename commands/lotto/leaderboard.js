import { SlashCommandBuilder } from 'discord.js';
import { lottoStatsManager } from '../../utils/lottoStatsManager.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Show the lotto leaderboard.');

export const command = {
  name: 'leaderboard',
  aliases: ['lb', 'leaderboard'],
  description: 'Show the lotto leaderboard.',

  async execute(message) {
    const guildId = message.guild.id;
    const leaderboard = lottoStatsManager.getLeaderboard(guildId);

    if (!leaderboard || leaderboard.length === 0) {
      return message.reply('No data available for leaderboard.');
    }

    let reply = '**Lotto Leaderboard**\n';
    leaderboard.slice(0, 10).forEach((entry, idx) => {
      reply += `\`${idx + 1}.\` <@${entry.userId}> - Wins: **${entry.wins}**, Entries: **${entry.entries}**\n`;
    });

    message.reply(reply);
  },

  async slash(interaction) {
    const guildId = interaction.guild.id;
    const leaderboard = lottoStatsManager.getLeaderboard(guildId);

    if (!leaderboard || leaderboard.length === 0) {
      return interaction.reply({ content: 'No data available for leaderboard.', ephemeral: true });
    }

    let reply = '**Lotto Leaderboard**\n';
    leaderboard.slice(0, 10).forEach((entry, idx) => {
      reply += `\`${idx + 1}.\` <@${entry.userId}> - Wins: **${entry.wins}**, Entries: **${entry.entries}**\n`;
    });

    interaction.reply(reply);
  },
}; 
