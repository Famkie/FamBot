import { SlashCommandBuilder } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';

export const data = new SlashCommandBuilder()
  .setName('joinkarmalotto')
  .setDescription('Join the current lotto via Karma (jika mode karma aktif).');

async function execute(interaction) {
  const guildId = interaction.guild.id;
  const userId = interaction.user.id;

  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) {
    return interaction.reply({ content: '❌ Tidak ada lotto aktif.', ephemeral: true });
  }

  if (!lotto.karma) {
    return interaction.reply({ content: '⚠️ Lotto ini tidak mengaktifkan mode Karma.', ephemeral: true });
  }

  lotto.entries = lotto.entries || [];

  if (lotto.entries.includes(userId)) {
    return interaction.reply({ content: '❌ Kamu sudah bergabung dalam lotto ini.', ephemeral: true });
  }

  if (interaction.user.bot) {
    return interaction.reply({ content: '❌ Bot tidak bisa join lotto.', ephemeral: true });
  }

  lotto.entries.push(userId);
  return interaction.reply({ content: '✅ Kamu telah bergabung ke lotto melalui Karma!' });
}

export default {
  data,
  name: 'joinkarmalotto',
  aliases: ['joinkarma', 'jkarma', 'jkl'],
  execute,
};
