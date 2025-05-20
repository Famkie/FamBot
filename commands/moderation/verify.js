import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname tidak tersedia di ESM, jadi buat manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tornUsersPath = path.join(__dirname, '..', 'data', 'tornUsers.json');

export default {
  name: 'verify',
  description: 'Verifikasi akun Torn City kamu',
  options: [
    {
      name: 'tornid',
      type: 3,
      description: 'ID Torn City kamu',
      required: true,
    },
  ],
  slashExecute: async (interaction) => {
    const discordId = interaction.user.id;
    const tornId = interaction.options.getString('tornid');

    let users = [];
    if (fs.existsSync(tornUsersPath)) {
      users = JSON.parse(fs.readFileSync(tornUsersPath, 'utf8'));
    }

    const existing = users.find((u) => u.discordId === discordId);
    if (existing) {
      return interaction.reply({ content: 'Kamu sudah terverifikasi!', ephemeral: true });
    }

    users.push({ discordId, tornId });
    fs.writeFileSync(tornUsersPath, JSON.stringify(users, null, 2));

    return interaction.reply({ content: `Berhasil verifikasi sebagai Torn ID: ${tornId}`, ephemeral: true });
  },
};
