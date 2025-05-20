import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../data/tornUsers.json');

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify({}, null, 2));
  }
}

export async function getTornUser(userId) {
  await ensureFile();

  const data = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(data);
  return users[userId] || null;
}

export async function setTornUser(userId, key) {
  await ensureFile();

  const data = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(data);

  users[userId] = { key };
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}
