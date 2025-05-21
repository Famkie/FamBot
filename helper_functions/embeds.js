// helper_functions/embed.js

import { General_functions } from './general.js';
import { Components_functions } from './components.js';
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu
} from 'discord.js';

async function limit_buttons(the_reply, interaction) {
  return the_reply;
}

async function check_reply(the_reply, interaction, fields_limit = 25, new_lines_limit = 99999999) {
  the_reply = await limit_embed(the_reply, interaction, fields_limit, new_lines_limit);
  the_reply = await limit_buttons(the_reply, interaction);
  return the_reply;
}

function get_nth_position_of_substring(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function replace_elem_with_array(array, elem, new_array) {
  const index = array.indexOf(elem);
  return [
    ...array.slice(0, index),
    ...new_array,
    ...array.slice(index + 1)
  ];
}

async function limit_embed(returning, interaction, fields_limit, new_lines_limit) {
  const embed = General_functions.copy(returning.embeds[0]);

  embed.fields.forEach(field => {
    if (field.value === '') field.value = 'Empty field!';
  });

  for (const field2 of embed.fields) {
    const field = General_functions.copy(field2);
    let count = (field.value.match(/\n/g) || []).length;
    const fields = [field];

    while (count > new_lines_limit) {
      const nth = get_nth_position_of_substring(fields.at(-1).value, '\n', new_lines_limit + 1);
      const new_last = {
        name: fields.at(-1).name,
        value: fields.at(-1).value.substring(nth + 1),
        inline: fields.at(-1).inline
      };
      fields.at(-1).value = fields.at(-1).value.substring(0, nth);
      if (new_last.value !== '') fields.push(new_last);
      count = (fields.at(-1).value.match(/\n/g) || []).length;
    }

    embed.fields = replace_elem_with_array(embed.fields, field2, fields);
  }

  for (const field of embed.fields) {
    if (field.value.length > 1024) {
      const the_fields = [field];
      while (the_fields[0].value.length > 1024) {
        const overflow = the_fields[0].value.length - 1024;
        let next = overflow + the_fields[0].value.substring(overflow).indexOf('\n');
        if (next === -1) next = overflow + the_fields[0].value.substring(overflow).indexOf(' ');
        if (next === -1) next = overflow;

        const field1 = {
          name: field.name,
          value: the_fields[0].value.substring(0, next),
          inline: field.inline
        };
        const field2 = {
          name: field.name,
          value: the_fields[0].value.substring(next),
          inline: field.inline
        };

        the_fields.splice(0, 1, field1, field2);
      }

      the_fields.forEach((f, idx) => {
        f.name += ` ${idx + 1}/${the_fields.length}`;
      });

      embed.fields = replace_elem_with_array(embed.fields, field, the_fields);
    }
  }

  const messages = [[]];
  const desc = embed.description || '';
  const footer = embed.footer.text || '';
  let totalLength = (embed.title?.length || 0) + desc.length + footer.length;
  if (embed.author?.name) totalLength += embed.author.name.length;

  let currentLength = totalLength;

  for (const field of embed.fields) {
    const fieldLen = field.name.length + field.value.length;
    if (messages.at(-1).length + 1 > fields_limit || currentLength + fieldLen > 6000) {
      messages.push([field]);
      currentLength = fieldLen;
    } else {
      messages.at(-1).push(field);
      currentLength += fieldLen;
    }
  }

  const pages = [];
  let pageNum = 1;
  for (const group of messages) {
    const newEmbed = General_functions.copy(embed);
    newEmbed.fields = group;
    newEmbed.footer.text = `Page ${pageNum}/${messages.length}`;
    const page = General_functions.copy(returning);
    page.embeds = [newEmbed];
    pages.push(page);
    pageNum++;
  }

  return await pagination(pages, interaction, 1);
}

async function pagination(messages, interaction, defaultPage = 1) {
  let current = defaultPage - 1;

  async function reply(message, withButtons = true) {
    if (typeof message === 'function') {
      message = await message(interaction, add_buttons);
      return 'replied';
    } else {
      if (withButtons) message = await add_buttons(message);
      return message;
    }
  }

  async function next_page() {
    if (current < messages.length - 1) current++;
    const msg = messages[current];
    const result = await reply(msg, true);
    if (result !== 'replied') await interaction.editReply(result);
  }

  async function previous_page() {
    if (current > 0) current--;
    const msg = messages[current];
    const result = await reply(msg, true);
    if (result !== 'replied') await interaction.editReply(result);
  }

  async function add_buttons(message) {
    const prev = await Components_functions.button(interaction, 'previous_page', 'Previous', 'SECONDARY', previous_page);
    const next = await Components_functions.button(interaction, 'next_page', 'Next', 'SECONDARY', next_page);
    const row = new MessageActionRow().addComponents(prev, next);

    if (message.components?.length) {
      message.components[0].components = message.components[0].components.filter(b =>
        !['next_page', 'previous_page'].includes(b.customId || b.custom_id)
      );
      message.components[0].components = [prev, next, ...message.components[0].components];
    } else {
      message.components = [row];
    }
    return message;
  }

  return await reply(messages[current], true);
}

export const Embed_functions = {
  check_reply,
  pagination
};
