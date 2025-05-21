import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { Id_api_functions } from '../helper_functions/id_api.js';

export const data = new SlashCommandBuilder()
  .setName('share-api')
  .setDescription('Shares or unshares your API key');

export async function execute(interaction) {
  const interaction_from = interaction.user;
  const done = await Id_api_functions.share_users_key(interaction_from.id, "!");
  return interaction.reply({ content: done });
}
