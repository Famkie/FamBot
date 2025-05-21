/*
async function get_users_faction(interaction_from) {
	let id = data["players"][ interaction_from.id.toString() ]["torn_id"]

	let url = general.make_url( "faction", id=faction_id, selections=["profile"] )
	info = await general.get_data_from_api( url, user_id=interaction_from.id, private=false )

}
*/
// helper_functions/faction.js

export async function members_info(faction) {
  let count = 0;
  let leader = '';
  let coleader = '';

  for (const id of Object.keys(faction.members)) {
    count++;
    const member = faction.members[id];

    if (parseInt(id) === faction.leader) {
      leader = member.name;
    }

    if (parseInt(id) === faction['co-leader']) {
      coleader = member.name;
    }
  }

  return {
    members_count: count,
    leader_name: leader,
    coleader_name: coleader
  };
}

export const Faction_functions = {
  members_info
};
