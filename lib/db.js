import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import crypto from 'crypto';

const file = path.join(process.cwd(), 'volunteers.json');
const adapter = new JSONFile(file);

let dbInstance;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function getDb() {
  if (!dbInstance) {
    dbInstance = new Low(adapter, { volunteers: [], nextId: 1, users: [] });
    await dbInstance.read();

    dbInstance.data ||= { volunteers: [], nextId: 1, users: [] };
    if (!Array.isArray(dbInstance.data.volunteers)) dbInstance.data.volunteers = [];
    if (!dbInstance.data.nextId) dbInstance.data.nextId = 1;
    if (!Array.isArray(dbInstance.data.users)) dbInstance.data.users = [];

    // Seed default admin user (admin / admin123) on first run
    if (dbInstance.data.users.length === 0) {
      dbInstance.data.users.push({
        id: 1,
        username: 'admin',
        password: hashPassword('admin123'),
        role: 'admin',
      });
    }

    await dbInstance.write();
  }
  return dbInstance;
}

export { hashPassword };
export default getDb;
