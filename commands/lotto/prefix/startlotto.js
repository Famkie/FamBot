import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';
import { isValidPrize, parsePrize } from '../../utils/validators.js';

export async function executePrefixCommand(ctx, args = []) {
  const user = ctx.author;
  const prize = args[0];
  const base = args[1] || 'ping';
  const flags = args.slice(2).join(' ');

  const added = flags.includes('added:true');
  const karma = flags.includes('karma:true');
  const faction = flags.includes('faction:true');
  const message = flags.replace(/(\w+:true)/g, '').trim();

  if (!isValidPrize(prize)) {
    return ctx.reply('Hadiah tidak valid. Contoh: 500k atau 1m');
  }

  const parsedPrize = parsePrize(prize);
  const config = { user, prize: parsedPrize, base, added, karma, faction, message };
  const result = await lottoManager.startLotto(ctx.guild, config);

  if (!result.success) {
    return ctx.reply(`Gagal memulai undian: ${result.message}`);
  }

  const embed = new EmbedBuilder()
    .setTitle('Lotto Dimulai!')
    .setDescription(`Hadiah: **${parsedPrize}**\nTipe: **${base}**\nTambah: **${added ? 'Ya' : 'Tidak'}**\nKarma: **${karma ? 'Ya' : 'Tidak'}**\nFaction Only: **${faction ? 'Ya' : 'Tidak'}**`)
    .setColor(0x00AE86)
    .setFooter({ text: `Dibuat oleh ${user.username}`, iconURL: user.displayAvatarURL() })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('join_lotto')
      .setLabel('Join Lotto')
      .setStyle(ButtonStyle.Success)
  );

  return ctx.reply({ embeds: [embed], components: [row] });
    }
