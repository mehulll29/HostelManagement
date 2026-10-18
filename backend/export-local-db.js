const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LOCAL_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';
const BACKUP_DIR = path.join(__dirname, 'db_backup');

async function exportLocalDb() {
  console.log(`Connecting to local MongoDB: ${LOCAL_URI}...`);
  const client = new MongoClient(LOCAL_URI);

  try {
    await client.connect();
    const db = client.db();
    const dbName = db.databaseName;
    console.log(`Connected to local database: ${dbName}`);

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collection(s):`, collections.map(c => c.name));

    const manifest = {
      database: dbName,
      exportedAt: new Date().toISOString(),
      collections: {}
    };

    for (const colInfo of collections) {
      const colName = colInfo.name;
      const col = db.collection(colName);
      const docs = await col.find({}).toArray();
      const indexes = await col.indexes();

      const filePath = path.join(BACKUP_DIR, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');

      const indexFilePath = path.join(BACKUP_DIR, `${colName}.indexes.json`);
      fs.writeFileSync(indexFilePath, JSON.stringify(indexes, null, 2), 'utf-8');

      manifest.collections[colName] = {
        count: docs.length,
        file: `${colName}.json`,
        indexCount: indexes.length
      };

      console.log(`  Exported ${colName}: ${docs.length} document(s) -> db_backup/${colName}.json`);
    }

    fs.writeFileSync(path.join(BACKUP_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`\nLocal database successfully dumped to: ${BACKUP_DIR}`);
  } catch (err) {
    console.error('Export failed:', err.message);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  exportLocalDb();
}

module.exports = exportLocalDb;
