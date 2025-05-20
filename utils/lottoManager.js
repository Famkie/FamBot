export const lottoManager = {
  activeLottos: new Map(),

  async startLotto(guild, config) {
    const { user, prize, base, added, karma, faction, message } = config;

    if (this.activeLottos.has(guild.id)) {
      return { success: false, message: 'A lotto is already running in this server.' };
    }

    this.activeLottos.set(guild.id, {
      host: user.id,
      prize,
      base,
      added,
      karma,
      faction,
      message,
      entries: [],
      createdAt: Date.now(),
    });

    return { success: true };
  },

  getLotto(guildId) {
    return this.activeLottos.get(guildId);
  },

  joinLotto(guildId, userId) {
    const lotto = this.getLotto(guildId);
    if (!lotto) return { success: false, message: 'No active lotto.' };
    if (lotto.entries.includes(userId)) return { success: false, message: 'You already joined.' };

    lotto.entries.push(userId);
    return { success: true, message: 'Successfully joined.' };
  },

  endLotto(guildId) {
    if (!this.activeLottos.has(guildId)) return { success: false, message: 'No active lotto to end.' };
    this.activeLottos.delete(guildId);
    return { success: true };
  },

  drawWinner(guildId) {
    const lotto = this.getLotto(guildId);
    if (!lotto || lotto.entries.length === 0) return { success: false, message: 'No participants to draw from.' };

    const winnerId = lotto.entries[Math.floor(Math.random() * lotto.entries.length)];
    return { success: true, winnerId };
  },
};
