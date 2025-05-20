import { lottoStatsManager } from './lottoStatsManager.js';

export const lottoLeaderboard = {
  getTopWinners(guildId, limit = 10) {
    const winnersMap = lottoStatsManager.getWinners(guildId);
    if (!winnersMap) return [];

    // Convert Map to array and sort by win count descending
    const sorted = [...winnersMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted; // Array of [userId, winCount]
  },

  getTopParticipants(guildId, limit = 10) {
    const entriesMap = lottoStatsManager.getEntries(guildId);
    if (!entriesMap) return [];

    const sorted = [...entriesMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted; // Array of [userId, entryCount]
  },
};
