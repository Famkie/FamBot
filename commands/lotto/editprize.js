import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { lottoManager } from '../../utils/lottoManager.js';

export const data = new SlashCommandBuilder()
  .setName('editprize')
  .setDescription('Edit prize of the active lotto.')
  .addStringOption(option =>
    option.setName('newprize')
      .setDescription('The new prize to set')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const command = {
  name: 'editprize',
  aliases: ['editprize'],
  description: 'Edit the prize of the active lotto.',
  permissions: ['ManageGuild'],

  async execute(message, args) {
    const guildId = message.guild.id;
    const lotto = lottoManager.getLotto(guildId);
    if (!lotto) return message.reply('No active lotto.');
    
    const authorId = message.author.id;
    if (lotto.host !== authorId && !message.member.permissions.has('ManageGuild')) {
      return message.reply('Only the host or an admin can edit the prize.');
    }

    const newPrize = args.join(' ');
    if (!newPrize) return message.reply('Please provide a new prize.');

    lotto.prize = newPrize;
    return message.reply(`Prize has been updated to: **${newPrize}**`);
  },

  async slash(interaction) {
    const guildId = interaction.guild.id;
    const lotto = lottoManager.getLotto(guildId);
    if (!lotto) return interaction.reply({ content: 'No active lotto.', ephemeral: true });

    const userId = interaction.user.id;
    if (lotto.host !== userId && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: 'Only the host or an admin can edit the prize.', ephemeral: true });
    }

    const newPrize = interaction.options.getString('newprize');
    lotto.prize = newPrize;

    return interaction.reply(`Prize has been updated to: **${newPrize}**`);
  },
};
