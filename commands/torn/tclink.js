import { SlashCommandBuilder } from 'discord.js';
import fetchTornData from '../../utils/fetchTorn.js';
import { setTornUser } from '../../utils/tornUsers.js';

export const data = new SlashCommandBuilder()
  .setName('tclink')
  .setDescription('Verifikasi akun Torn City kamu')
  .addStringOption(option =>
    option.setName('apikey')
      .setDescription('API key Torn City kamu')
      .setRequired(true)
  );

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const apiKey = interaction.options.getString('apikey');

  const data = await fetchTornData('user', 'basic,profile', apiKey);

  if (data.error) {
    return interaction.editReply(`Gagal verifikasi: ${data.error}`);
  }

  await setTornUser(interaction.user.id, apiKey);

  return interaction.editReply(
    `Berhasil terverifikasi sebagai **${data.name}** [${data.player_id}]`
  );
}
