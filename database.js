import { MongoClient } from "mongodb";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var data = {
  players: {},
  servers: {},
  general: {
    shared_apis: {
      apis: [],
      index: -1,
    },
  },
  alerts: [],
  alerts_raw: [],
};

let config = false;
try {
  const configRaw = await readFile(path.join(__dirname, "config.json"), "utf-8");
  config = JSON.parse(configRaw);
} catch (error) {
  // fallback jika config.json gak ada
  config = {
    clientId: "1353359090385944626",
    guildId: "1353368445395275776",
    error_channel: "1355791785376350330",
    status_channel: "1353359090897911810",
    commands_channel: "1353367542030405733",
    token: process.env.token,
    db_string: process.env.db_string,
  };
}

const uri = config.db_string;
let client = false;

if (uri !== undefined) {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function makeData() {
  if (client === false) {
    return;
  }
  await client.connect();

  const players = client.db("database0").collection("players");
  let result = players.find({});
  await result.forEach((player) => {
    delete player["_id"];
    data.players[player.discord_id.toString()] = player;
    if (player.share_api_key === true) {
      data.general.shared_apis.apis.push({
        discord_id: player.discord_id,
      });
    }
  });

  const servers = client.db("database0").collection("servers");
  result = servers.find({});
  await result.forEach((server) => {
    delete server["_id"];
    data.servers[server.server_id.toString()] = server;
  });

  const alerts = client.db("database0").collection("alerts");
  result = alerts.find({});
  await result.forEach((alert) => {
    delete alert["_id"];
    data.alerts_raw.push(alert);
  });

  await client.close();
  return data;
}

function getData() {
  return data;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let connected = false;

async function setData(new_data, update) {
  data = new_data;
  if (client === false) {
    return "done";
  }
  if (update !== false) {
    while (connected === true) {
      await sleep(100);
    }
    connected = true;
    await client.connect();
    for (let col_name of Object.keys(update)) {
      const col = client.db("database0").collection(col_name);
      await col.bulkWrite(update[col_name]);
    }
    await client.close();
    connected = false;
  }
  return "done";
}

function user_to_db(user) {
  return user;
}

const Database = {
  getData,
  setData,
  makeData,
  user_to_db,
};

export { Database };
