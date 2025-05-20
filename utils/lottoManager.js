export const lottoManager = {
  activeLottos: new Map(),

  async startLotto(guild, config) {
    const { user, prize, base, added, karma, faction, message } = config;

    // Store in a DB or memory depending on mode
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
};
