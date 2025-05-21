import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder
} from 'discord.js';

import { Message_constructors } from '../../message_constructors/index.js';

const data = new SlashCommandBuilder()
  .setName('faction')
  .setDescription('Shows profile of some faction')
  .addIntegerOption(option =>
    option.setName('faction_id')
      .setDescription('The faction ID')
      .setRequired(false)
  );

async function execute(interaction) {
  const id = interaction.options.getInteger('faction_id');
  const response = await Message_constructors.faction_profile({ interaction, id });
  return await interaction.reply(response);
}

export { data, execute };
