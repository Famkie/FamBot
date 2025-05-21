// helper_functions/discord.js
import { General_functions } from './general.js';

export async function rename_user(user_id, guild_id, name) {
  const client = General_functions.getClient();
  const guild = client.guilds.cache.get(guild_id);

  if (!guild) {
    return { error: 'Could not find guild' };
  }

  const member = await guild.members.fetch(user_id).catch(() => null);

  if (!member) {
    return { error: 'Could not find member' };
  }

  try {
    await member.setNickname(name);
    return { done: true };
  } catch (error) {
    return { error };
  }
}

export const Discord_functions = {
  rename_user
};
