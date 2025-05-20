export const lottoStatsManager = {
  stats: new Map(), // Map<guildId, Map<userId, { wins: number, entries: number }>>

  recordEntry(guildId, userId) {
    if (!this.stats.has(guildId)) this.stats.set(guildId, new Map());

    const guildStats = this.stats.get(guildId);
    if (!guildStats.has(userId)) guildStats.set(userId, { wins: 0, entries: 0 });

    guildStats.get(userId).entries++;
  },

  recordWin(guildId, userId) {
    if (!this.stats.has(guildId)) this.stats.set(guildId, new Map());

    const guildStats = this.stats.get(guildId);
    if (!guildStats.has(userId)) guildStats.set(userId, { wins: 0, entries: 0 });

    guildStats.get(userId).wins++;
  },

  getLeaderboard(guildId) {
    if (!this.stats.has(guildId)) return [];

    const guildStats = this.stats.get(guildId);
    const arr = Array.from(guildStats.entries()).map(([userId, data]) => ({
      userId,
      wins: data.wins,
      entries: data.entries,
    }));

    // Sort by wins desc, then entries desc
    arr.sort((a, b) => b.wins - a.wins || b.entries - a.entries);
    return arr;
  },
};
