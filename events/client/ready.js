module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot ${client.user.tag} sudah online!`);
    client.user.setActivity('/help | KieBot', { type: 'PLAYING' }); // Status bot
  },
};
