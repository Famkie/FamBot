import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';

export const data = new SlashCommandBuilder()
  .setName('lottoinfo')
  .setDescription('Menampilkan info undian (lotto) yang sedang berlangsung.');

async function execute(interaction) {
  const lotto = lottoManager.getLotto(interaction.guild.id);

  if (!lotto) {
    return interaction.reply({ content: '❌ Tidak ada undian aktif di server ini.', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setColor(0x00bfff)
    .setTitle('Informasi Undian Aktif')
    .addFields(
      { name: 'Host', value: `<@${lotto.host}>`, inline: true },
      { name: 'Hadiah', value: lotto.prize.toString(), inline: true },
      { name: 'Tipe', value: lotto.base.toString(), inline: true },
      { name: 'Tambah', value: lotto.added ? 'Ya' : 'Tidak', inline: true },
      { name: 'Karma', value: lotto.karma ? 'Aktif' : 'Nonaktif', inline: true },
      { name: 'Faction Only', value: lotto.faction ? 'Ya' : 'Tidak', inline: true },
      { name: 'Peserta', value: `${lotto.entries.length} pengguna`, inline: true },
      { name: 'Dibuat Pada', value: `<t:${Math.floor(lotto.createdAt / 1000)}:F>`, inline: false }
    );

  return interaction.reply({ embeds: [embed] });
}

export default {
  data,
  name: 'lottoinfo',
  aliases: ['lotinfo', 'li'],
  execute,
};
