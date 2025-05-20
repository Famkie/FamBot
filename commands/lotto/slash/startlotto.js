import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';
import { isValidPrize, parsePrize } from '../../utils/validators.js';
import { executePrefixCommand } from './startlotto_prefix.js';

export const data = new SlashCommandBuilder()
  .setName('startlotto')
  .setDescription('Memulai undian baru dengan berbagai opsi.')
  .addStringOption(opt =>
    opt.setName('prize').setDescription('Hadiah (contoh: 500k, 1m)').setRequired(true))
  .addStringOption(opt =>
    opt.setName('base')
      .setDescription('Tipe dasar: ping | noping | quick')
      .setRequired(true)
      .addChoices(
        { name: 'ping', value: 'ping' },
        { name: 'noping', value: 'noping' },
        { name: 'quick', value: 'quick' }
      ))
  .addBooleanOption(opt => opt.setName('added').setDescription('Aktifkan undian bertambah'))
  .addBooleanOption(opt => opt.setName('karma').setDescription('Aktifkan undian karma'))
  .addBooleanOption(opt => opt.setName('faction').setDescription('Hanya untuk faction'))
  .addStringOption(opt => opt.setName('message').setDescription('Pesan pengumuman opsional'));

const aliases = ['sl', 'slnp', 'slk', 'sla', 'slq', 'slak', 'slf', 'ksl', 'asl', 'slanp', 'qsl', 'fsl'];

async function execute(ctx, client, args = []) {
  if (ctx.isChatInputCommand) {
    return executeSlashCommand(ctx);
  } else {
    return executePrefixCommand(ctx, args);
  }
}

async function executeSlashCommand(ctx) {
  const user = ctx.user;
  const prize = ctx.options.getString('prize');
  const base = ctx.options.getString('base');
  const added = ctx.options.getBoolean('added') || false;
  const karma = ctx.options.getBoolean('karma') || false;
  const faction = ctx.options.getBoolean('faction') || false;
  const message = ctx.options.getString('message') || '';

  if (!isValidPrize(prize)) {
    return ctx.reply({ content: 'Hadiah tidak valid. Contoh: 500k atau 1m', ephemeral: true });
  }

  const parsedPrize = parsePrize(prize);
  const config = { user, prize: parsedPrize, base, added, karma, faction, message };
  const result = await lottoManager.startLotto(ctx.guild, config);

  if (!result.success) {
    return ctx.reply({ content: `Gagal memulai undian: ${result.message}`, ephemeral: true });
  }

  const embed = buildLottoEmbed(user, parsedPrize, base, added, karma, faction);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('join_lotto')
      .setLabel('Join Lotto')
      .setStyle(ButtonStyle.Success)
  );

  return ctx.reply({ embeds: [embed], components: [row] });
}

function buildLottoEmbed(user, prize, base, added, karma, faction) {
  return new EmbedBuilder()
    .setTitle('Lotto Dimulai!')
    .setDescription(`Hadiah: **${prize}**\nTipe: **${base}**\nTambah: **${added ? 'Ya' : 'Tidak'}**\nKarma: **${karma ? 'Ya' : 'Tidak'}**\nFaction Only: **${faction ? 'Ya' : 'Tidak'}**`)
    .setColor(0x00AE86)
    .setFooter({ text: `Dibuat oleh ${user.username}`, iconURL: user.displayAvatarURL() })
    .setTimestamp();
}

export default {
  data,
  name: 'startlotto',
  aliases,
  execute,
};
