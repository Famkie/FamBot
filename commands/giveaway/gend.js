import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('Akhiri giveaway dan pilih pemenang')
    .addStringOption(opt =>
      opt.setName('message_id')
        .setDescription('ID pesan giveaway')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('winners')
        .setDescription('Jumlah pemenang')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const winnersAmount = interaction.options.getInteger('winners');

    try {
      const giveawayMsg = await interaction.channel.messages.fetch(messageId);
      const reaction = giveawayMsg.reactions.cache.get('🎉');

      if (!reaction) {
        return interaction.reply({
          content: 'Tidak ada reaksi 🎉 pada pesan tersebut.',
          ephemeral: true,
        });
      }

      const users = await reaction.users.fetch();
      const entries = users.filter(user => !user.bot);
      if (entries.size === 0) {
        return interaction.reply({
          content: 'Tidak ada peserta pada giveaway tersebut.',
          ephemeral: true,
        });
      }

      const entriesArray = [...entries.values()];
      const winners = [];

      while (winners.length < Math.min(winnersAmount, entriesArray.length)) {
        const randomIndex = Math.floor(Math.random() * entriesArray.length);
        const selected = entriesArray.splice(randomIndex, 1)[0];
        winners.push(selected);
      }

      return interaction.reply({
        content: `🎉 **Giveaway Selesai!** Pemenang:\n${winners.map(w => `<@${w.id}>`).join('\n')}`,
        allowedMentions: { users: winners.map(w => w.id) },
      });

    } catch (err) {
      console.error('Gagal mengakhiri giveaway:', err);
      return interaction.reply({
        content: 'Terjadi kesalahan saat mengambil data giveaway.',
        ephemeral: true,
      });
    }
  }
};

export default command;
