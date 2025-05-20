import { lottoManager } from '../../utils/lottoManager.js';

async function execute(message, args = []) {
  const guildId = message.guild.id;
  const userId = message.author.id;

  const lotto = lottoManager.getLotto(guildId);

  if (!lotto) {
    return message.reply('❌ Tidak ada lotto aktif.');
  }
  if (!lotto.karma) {
    return message.reply('⚠️ Lotto ini tidak mengaktifkan mode Karma.');
  }
  if (lotto.entries.includes(userId)) {
    return message.reply('❌ Kamu sudah bergabung dalam lotto ini.');
  }

  lotto.entries.push(userId);
  return message.reply('✅ Kamu telah bergabung ke lotto melalui Karma!');
}

export const command = {
  name: 'joinkarma',
  aliases: ['joinkarmalotto', 'jkl'],
  description: 'Join lotto via Karma mode (prefix only)',
  execute,
};
