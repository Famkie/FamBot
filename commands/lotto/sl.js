import { SlashCommandBuilder } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';
import { isValidPrize, parsePrize } from '../../utils/validators.js';

const data = new SlashCommandBuilder()
  .setName('startlotto')
  .setDescription('Starts a new lottery with various options.')
  .addStringOption(opt =>
    opt.setName('prize')
      .setDescription('Prize for the lotto (e.g., 500k, 1m)')
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('base')
      .setDescription('Base type: ping | noping | quick')
      .setRequired(true)
      .addChoices(
        { name: 'ping', value: 'ping' },
        { name: 'noping', value: 'noping' },
        { name: 'quick', value: 'quick' }
      ))
  .addBooleanOption(opt =>
    opt.setName('added')
      .setDescription('Enable additive lotto'))
  .addBooleanOption(opt =>
    opt.setName('karma')
      .setDescription('Enable karma lotto'))
  .addBooleanOption(opt =>
    opt.setName('faction')
      .setDescription('Faction only lotto'))
  .addStringOption(opt =>
    opt.setName('message')
      .setDescription('Optional lotto announcement message'));

const aliases = ['sl', 'slnp', 'slk', 'sla', 'slq', 'slak', 'slf', 'ksl', 'asl', 'slanp', 'qsl', 'fsl'];

async function execute(interaction, args, isSlash = false) {
  const user = isSlash ? interaction.user : interaction.author;

  let prize = isSlash ? interaction.options.getString('prize') : args[0];
  let base = isSlash ? interaction.options.getString('base') : args[1] || 'ping';
  const added = isSlash ? interaction.options.getBoolean('added') : args.includes('added:true');
  const karma = isSlash ? interaction.options.getBoolean('karma') : args.includes('karma:true');
  const faction = isSlash ? interaction.options.getBoolean('faction') : args.includes('faction:true');
  const message = isSlash ? interaction.options.getString('message') : args.slice(2).join(' ');

  if (!isValidPrize(prize)) {
    const reply = 'Invalid prize. Example: 500k or 1m';
    return isSlash ? interaction.reply({ content: reply, ephemeral: true }) : interaction.reply(reply);
  }

  const parsedPrize = parsePrize(prize);
  const config = { user, prize: parsedPrize, base, added, karma, faction, message };

  const result = await lottoManager.startLotto(interaction.guild, config);

  const reply = result.success
    ? `Lotto started: ${parsedPrize} | Base: ${base} | Added: ${added ? 'Yes' : 'No'} | Karma: ${karma ? 'Yes' : 'No'}`
    : `Failed to start lotto: ${result.message}`;

  return isSlash ? interaction.reply(reply) : interaction.reply(reply);
}

export default {
  data,
  name: 'startlotto',
  aliases,
  execute,
};
