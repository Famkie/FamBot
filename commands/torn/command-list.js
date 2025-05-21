import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { Alerts_general } from '../alerts/general.js';
import { Embed_functions } from '../helper_functions/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('command-list')
  .setDescription('Get list of commands of this bot.');

export async function execute(interaction) {
  let the_list = '';
  for (const [key, value] of interaction.client.commands) {
    the_list += `${value.data.name}\n`;
  }

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Command list')
    .addFields([{ name: 'Commands', value: the_list, inline: true }])
    .setTimestamp()
    .setFooter({ text: 'Page 1/1' });

  const to_reply = await Embed_functions.check_reply(
    { embeds: [embed] },
    interaction,
    25,
    25
  );

  await interaction.reply(to_reply);
}
