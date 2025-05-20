import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const name = 'fitur';
export const aliases = ['features', 'help'];
export const data = new SlashCommandBuilder()
  .setName('fitur')
  .setDescription('Menampilkan daftar fitur bot yang tersedia');

export async function execute(message) {
  const embed = new EmbedBuilder()
    .setTitle('Fitur Terkini Bot')
    .setColor('Random')
    .setDescription('Berikut adalah fitur yang sudah tersedia di bot:')
    .addFields(
      { name: '🎉 Giveaway', value: '`!gstart <durasi> <jumlah> <hadiah>`\nMulai giveaway otomatis.' },
      { name: '⭐ Karma Point', value: '`!gg`\nMemberikan poin karma ke pengguna lain.' },
      { name: '🔁 Alias Command', value: 'Gunakan alias seperti `!gw`, `!features`, dll.' },
      { name: '📁 Command Handler', value: 'Struktur modular per folder dan event.' },
      { name: '⚙️ Slash Command', value: 'Gunakan `/fitur`, `/gstart`, dll secara native Discord.' },
      { name: '🌐 Keep Alive', value: 'Bot tetap aktif di Cybrancee / Replit.' }
    )
    .setFooter({ text: 'Bot by Kamu' });

  await message.reply({ embeds: [embed] });
}

export async function slashExecute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('Fitur Terkini Bot')
    .setColor('Random')
    .setDescription('Berikut adalah fitur yang sudah tersedia di bot:')
    .addFields(
      { name: '🎉 Giveaway', value: '`/gstart <durasi> <jumlah> <hadiah>`' },
      { name: '⭐ Karma Point', value: '`!gg` untuk kasih poin ke user lain.' },
      { name: '🔁 Alias Support', value: '`!gw`, `!features`, dll sebagai alias command.' },
      { name: '⚙️ Slash Commands', value: 'Dukung penuh slash command modern Discord.' },
      { name: '🧠 Modular Handler', value: 'Command & event terpisah dan rapih.' },
      { name: '☁️ Hosting Ready', value: 'Siap untuk Replit, Cybrancee, dan VPS.' }
    )
    .setFooter({ text: 'Bot by Enma [3604249]' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
