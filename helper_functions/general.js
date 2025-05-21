import axios from 'axios';
import fs from 'fs';

import { Torn_data } from '../torn/index.js';
import { Database } from '../database.js';

function template(which) {
  if (which === "user") {
    let user = {
      "torn_id": "",
      "torn_name": "",
      "discord_id": "",
      "torn_api_key": "",
      "share_api_key": false
    };
    return user;
  } else if (which === "server") {
    let server = {
      "server_id": "",
      "tags": {}
    };
    return server;
  }
}

async function get_user(user_id) {
  let data = Database.getData();
  if (Object.keys(data["players"]).includes(user_id.toString())) {
    return data["players"][user_id.toString()];
  }
  let template_user = template("user");
  template_user["discord_id"] = user_id.toString();
  await Database.setData(data, { "players": [{ "insertOne": { document: template_user } }] });
  data["players"][user_id.toString()] = template_user;
  return template_user;
}

async function get_server(server_id) {
  let data = Database.getData();
  if (Object.keys(data["servers"]).includes(server_id.toString())) {
    return data["servers"][server_id.toString()];
  }
  let template_server = template("server");
  template_server["server_id"] = server_id.toString();
  await Database.setData(data, { "servers": [{ "insertOne": { document: template_server } }] });
  data["servers"][server_id.toString()] = template_server;
  return template_server;
}

function get_user_by_key(key, value) {
  let data = Database.getData();
  for (let player of data["players"]) {
    if (player[key].toString() === value.toString()) {
      return player;
    }
  }
  return undefined;
}

async function http_request(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error.config);
    return { "error": "Error while making http request!" };
  }
}

function make_url(category, id = "", selections = [], key = "") {
  let selection = selections.map(sel => sel).join(",");
  return `https://api.torn.com/${category}/${id}?selections=${selection}&key=${key}`;
}

function make_link(which, id = "", format = false) {
  let link = '';
  switch (which) {
    case "player_profile":
      link = `https://www.torn.com/profiles.php?XID=${id}`;
      break;
    case "faction_profile":
      link = `https://www.torn.com/factions.php?step=profile&ID=${id}`;
      break;
    case "company_profile":
      link = `https://www.torn.com/companies.php?step=profile&ID=${id}`;
      break;
    case "attack":
      link = `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}`;
      break;
    case "message":
      link = `https://www.torn.com/messages.php#/p=compose&XID=${id}`;
      break;
    case "send_money":
      link = `https://www.torn.com/sendcash.php#/XID=${id}`;
      break;
    case "trade":
      link = `https://www.torn.com/trade.php#step=start&userID=${id}`;
      break;
    case "place_bounty":
      link = `https://www.torn.com/bounties.php?p=add&XID=${id}`;
      break;
    case "add_friend":
      link = `https://www.torn.com/friendlist.php#/p=add&XID=${id}`;
      break;
    case "add_enemy":
      link = `https://www.torn.com/blacklist.php#/p=add&XID=${id}`;
      break;
    case "personal_stats":
      link = `https://www.torn.com/personalstats.php?ID=${id}`;
      break;
    case "player_bazaar":
      link = `https://www.torn.com/bazaar.php?userId=${id}`;
      break;
    case "display_case":
      link = `https://www.torn.com/displaycase.php#display/${id}`;
      break;
    case "item_market":
      link = `https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${id.replaceAll(" ", "+")}`;
      break;
  }
  if (format !== false) {
    return `[${format}](${link})`;
  }
  return link;
}

function isInt(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function format_number(number) {
  if (number === null) return 0;
  if (!isInt(number)) number = number.toString();
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function make_random_str(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

let emojis = {};
async function set_emojis(new_emojis) {
  emojis = new_emojis;
}

function get_emoji(name) {
  return emojis[name];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function add_stock_options(option) {
  for (let acronym of Object.keys(Torn_data.stocks)) {
    option.addChoice(`${Torn_data.stocks[acronym].name} - ${acronym}`, acronym);
  }
  return option;
}

function delete_from_list_by_key(list, key, value) {
  return list.filter(x => x[key] != value);
}

function delete_from_list(list, remove) {
  return list.filter(item => item !== remove);
}

let client = undefined;
function getClient() {
  return client;
}
async function makeClient(new_client) {
  client = new_client;
}

async function mention_user(id) {
  let to_mention = await client.users.fetch(id);
  if (to_mention === undefined) return undefined;
  return to_mention.toString();
}

async function get_channel(id) {
  return client.channels.cache.get(id);
}

function get_files_in_folder(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      get_files_in_folder(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

function am_i_original() {
  return client.user.id === "892034594700951593" || client.user.id === 892034594700951593;
}

export const General_functions = {
  getClient,
  makeClient,
  mention_user,
  get_channel,
  get_user,
  get_server,
  http_request,
  make_url,
  make_link,
  format_number,
  make_random_str,
  copy,
  set_emojis,
  get_emoji,
  sleep,
  add_stock_options,
  delete_from_list_by_key,
  delete_from_list,
  get_files_in_folder,
  am_i_original,
  get_user_by_key
};
