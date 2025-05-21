import { Database } from "../database.js";
import { General_functions } from "./general.js";

async function is_allowed(member) {
  return member.permissions.has("ADMINISTRATOR");
}

async function edit_tag(server, tag_name, content) {
  let server_id = server.id.toString();

  let data = await Database.getData();
  let operation1;
  let return_message;

  if (content !== undefined) {
    operation1 = {
      updateOne: {
        filter: { server_id },
        update: { $set: {} },
      },
    };
    operation1.updateOne.update.$set["tags." + tag_name] = content;
    return_message = "Added/changed tag " + tag_name;
    data.servers[server_id].tags[tag_name] = content;
  } else {
    operation1 = {
      updateOne: {
        filter: { server_id },
        update: { $unset: {} },
      },
    };
    operation1.updateOne.update.$unset["tags." + tag_name] = 0;
    return_message = "Removed tag " + tag_name;
    delete data.servers[server_id].tags[tag_name];
  }

  await Database.setData(data, { servers: [operation1] });
  return return_message;
}

async function tag_list(server) {
  let server_from_db = await General_functions.get_server(server.id);
  return Object.keys(server_from_db.tags);
}

async function get_tag(server_object, tag_name) {
  let server = await General_functions.get_server(server_object.id);
  return server.tags[tag_name];
}

const Server_functions = {
  is_allowed,
  edit_tag,
  tag_list,
  get_tag,
};

export { Server_functions };
