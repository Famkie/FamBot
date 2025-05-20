import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const getLottoButtons = (options = {}) => {
  const join = new ButtonBuilder()
    .setCustomId('lotto_join')
    .setLabel('Join')
    .setStyle(ButtonStyle.Success);

  const draw = new ButtonBuilder()
    .setCustomId('lotto_draw')
    .setLabel('Draw')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(options?.disableDraw ?? false);

  const end = new ButtonBuilder()
    .setCustomId('lotto_end')
    .setLabel('End')
    .setStyle(ButtonStyle.Danger);

  const view = new ButtonBuilder()
    .setCustomId('lotto_view')
    .setLabel('View Participants')
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(join, draw, end, view);
  return [row];
};
