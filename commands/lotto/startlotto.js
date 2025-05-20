import { SlashCommandBuilder } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';
import { isValidPrize, parsePrize } from '../../utils/validators.js';

const data = new SlashCommandBuilder()
  .setName('startlotto')
  .setDescription('Memulai undian baru dengan berbagai opsi.')
  .addStringOption(opt =>
    opt.setName('prize')
      .setDescription('Hadiah (contoh: 500k, 1m)')
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('base')
      .setDescription('Tipe dasar: ping | noping | quick')
      .setRequired(true)
      .addChoices(
        { name: 'ping', value: 'ping' },
        { name: 'noping', value: 'noping' },
        { name: 'quick', value: 'quick' }
      ))
  .addBooleanOption(opt =>
    opt.setName('added')
      .setDescription('Aktifkan undian bertambah'))
  .addBooleanOption(opt =>
    opt.setName('karma')
      .setDescription('Aktifkan undian karma'))
  .addBooleanOption(opt =>
    opt.setName('faction')
      .setDescription('Hanya untuk faction'))
  .addStringOption(opt =>
    opt.setName('message')
      .setDescription('Pesan pengumuman opsional'));

const aliases = ['sl', 'slnp', 'slk', 'sla', 'slq', 'slak', 'slf', 'ksl', 'asl', 'slanp', 'qsl', 'fsl'];

async function execute(ctx, client, args = []) {
  const isSlash = !!ctx.isChatInputCommand;

  const user = isSlash ? ctx.user : ctx.author;
  const prize = isSlash ? ctx.options.getString('prize') : args[0];
  const base = isSlash ? ctx.options.getString('base') : args[1] || 'ping';
  const added = isSlash ? ctx.options.getBoolean('added') : args.includes('added:true');
  const karma = isSlash ? ctx.options.getBoolean('karma') : args.includes('karma:true');
  const faction = isSlash ? ctx.options.getBoolean('faction') : args.includes('faction:true');
  const message = isSlash ? ctx.options.getString('message') : args.slice(2).join(' ');

  if (!isValidPrize(prize)) {
    const reply = 'Hadiah tidak valid. Contoh: 500k atau 1m';
    return isSlash
      ? ctx.reply({ content: reply, ephemeral: true })
      : ctx.reply(reply);
  }

  const parsedPrize = parsePrize(prize);
  const config = { user, prize: parsedPrize, base, added, karma, faction, message };
  const result = await lottoManager.startLotto(ctx.guild, config);

  const reply = result.success
    ? `Undian dimulai: ${parsedPrize} | Base: ${base} | Added: ${added ? 'Ya' : 'Tidak'} | Karma: ${karma ? 'Ya' : 'Tidak'}`
    : `Gagal memulai undian: ${result.message}`;

  return isSlash ? ctx.reply(reply) : ctx.reply(reply);
}

export default {
  data,
  name: 'startlotto',
  aliases,
  execute,
};
