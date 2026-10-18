const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const dns = require('dns');

// Fix querySrv ECONNREFUSED on Windows by using Google and Cloudflare DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // fallback if environment restricts setting dns servers
}

require('dotenv').config();

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';
const ENV_FILE = path.join(__dirname, '.env');

function promptAtlasUri() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nEnter your MongoDB Atlas Connection String (mongodb+srv://...):\n> ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function formatAtlasUriWithDb(uri, dbName) {
  if (uri.includes('.mongodb.net/?')) {
    return uri.replace('.mongodb.net/?', `.mongodb.net/${dbName}?`);
  } else if (uri.endsWith('.mongodb.net/')) {
    return `${uri}${dbName}`;
  } else if (uri.endsWith('.mongodb.net')) {
    return `${uri}/${dbName}`;
  }
  return uri;
}

function updateEnvFile(newAtlasUri, dbName) {
  try {
    if (!fs.existsSync(ENV_FILE)) return;
    const finalUri = formatAtlasUriWithDb(newAtlasUri, dbName || 'hostel_management');
    let content = fs.readFileSync(ENV_FILE, 'utf-8');
    if (content.includes('MONGODB_URI=')) {
      content = content.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${finalUri}`);
    } else {
      content += `\nMONGODB_URI=${finalUri}\n`;
    }
    fs.writeFileSync(ENV_FILE, content, 'utf-8');
    console.log(`\nUpdated backend/.env MONGODB_URI to: ${finalUri}`);
  } catch (err) {
    console.warn(`Could not update .env automatically: ${err.message}`);
  }
}

async function runMigration() {
  console.log('========================================================');
  console.log('       MongoDB Local to Atlas Migration Utility         ');
  console.log('========================================================');

  let atlasUri = process.argv[2] || process.env.ATLAS_URI;
  if (!atlasUri) {
    atlasUri = await promptAtlasUri();
  }

  if (!atlasUri || !atlasUri.startsWith('mongodb')) {
    console.error('\nError: Invalid connection string. It should start with "mongodb://" or "mongodb+srv://".');
    process.exit(1);
  }

  // Ensure database name is in Atlas URI
  let targetDbName = 'hostel_management';
  
  console.log(`\n1. Connecting to Local MongoDB (${LOCAL_URI})...`);
  const localClient = new MongoClient(LOCAL_URI);
  let atlasClient;

  try {
    await localClient.connect();
    const localDb = localClient.db();
    targetDbName = localDb.databaseName || 'hostel_management';
    console.log(` Connected to local database: "${targetDbName}"`);

    console.log(`\n2. Connecting to MongoDB Atlas...`);
    atlasClient = new MongoClient(atlasUri);
    await atlasClient.connect();
    
    // If the Atlas URI does not specify a db or defaults to 'test', use targetDbName
    let atlasDb = atlasClient.db();
    if (!atlasDb.databaseName || atlasDb.databaseName === 'test') {
      atlasDb = atlasClient.db(targetDbName);
    }
    console.log(` Connected to Atlas! Target database: "${atlasDb.databaseName}"`);

    const collections = await localDb.listCollections().toArray();
    console.log(`\n3. Migrating ${collections.length} collection(s)...`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      // Skip system collections
      if (colName.startsWith('system.')) continue;

      const localCol = localDb.collection(colName);
      const atlasCol = atlasDb.collection(colName);

      const docs = await localCol.find({}).toArray();
      console.log(`   Transferring "${colName}" (${docs.length} document(s))...`);

      if (docs.length > 0) {
        // Clear destination collection before copying
        await atlasCol.deleteMany({});
        await atlasCol.insertMany(docs);
      }

      // Recreate custom indexes
      try {
        const indexes = await localCol.indexes();
        for (const idx of indexes) {
          if (idx.name !== '_id_') {
            const key = idx.key;
            const options = { name: idx.name };
            if (idx.unique) options.unique = true;
            await atlasCol.createIndex(key, options);
          }
        }
      } catch (idxErr) {
        // Non-critical if index already exists
      }

      console.log(`    Successfully migrated collection: ${colName}`);
    }

    console.log('\n========================================================');
    console.log('       Migration to MongoDB Atlas Completed! 🚀         ');
    console.log('========================================================');

    // Update .env with new Atlas URI if desired
    updateEnvFile(atlasUri, targetDbName);

  } catch (err) {
    console.error('\nMigration failed with error:', err.message);
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('Tip: Check your Atlas username and password in the connection string.');
    } else if (err.message.includes('queryTxt ETIMEOUT') || err.message.includes('whitelist') || err.message.includes('IP')) {
      console.error('Tip: Ensure your current IP is whitelisted under "Network Access" in MongoDB Atlas (e.g. 0.0.0.0/0).');
    }
    process.exit(1);
  } finally {
    await localClient.close();
    if (atlasClient) await atlasClient.close();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
