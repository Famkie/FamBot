export const command = {
  name: 'ping',
  description: 'Ping command',
  aliases: ['p'],
  async execute(message, args, client) {
    await message.reply('Pong!');
  }
};
