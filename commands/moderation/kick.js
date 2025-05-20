export const name = 'kick';
export const description = 'Kick seorang member dari server.';

export function execute(message, args) {
  if (!message.member.permissions.has('KickMembers')) {
    return message.reply("Kamu tidak punya izin untuk kick.");
  }

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply("Mention user yang ingin kamu kick.");
  }

  if (!member.kickable) {
    return message.reply("Aku tidak bisa kick user itu!");
  }

  member.kick().then(() => {
    message.channel.send(`${member.user.tag} telah di-kick.`);
  }).catch(err => {
    message.channel.send("Gagal kick user.");
    console.error(err);
  });
}
