import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export async function registerEvents(client) {
  // Dapatkan direktori current file (ESM tidak punya __dirname)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = (await fs.readdir(eventsPath)).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    // import dinamis ESM
    const event = await import(`file://${filePath}`);

    if (event.default.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
  }

  console.log(`[EVENTS] ${eventFiles.length} event(s) loaded.`);
}
