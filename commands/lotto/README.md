# KieBot - Lotto Command Module

This module contains all commands related to running and managing lotteries (lottos) in your Discord server, fully integrated with Torn City gameplay.

## Slash Command Format

`/startlotto prize:<prize> base:<ping|noping|quick> [added:true|false] [karma:true|false]`

**Note:**
- `<required>` parameters are mandatory.
- `[optional]` parameters are optional.

---

## Command List

### Start a Lotto
**Slash:** `/startlotto prize:<prize> base:<ping|noping|quick> [added:true] [karma:true]`  
**Prefix:** `!sl <prize>`  
Starts a lotto. Default type is `ping`.

**Aliases:** `sl`, `startlotto`

---

### Start a Lotto - No Ping
**Slash:** `/startlotto prize:<prize> base:noping`  
**Prefix:** `!slnp <prize> [message]`  
Starts a lotto without pinging users.

**Aliases:** `slnp`, `npsl`, `startlottonoping`

---

### Start a Lotto - Karma
**Slash:** `/startlotto prize:<prize> base:<ping|noping> karma:true`  
**Prefix:** `!slk <prize>`  
Starts a karma-based lotto where users can buy extra entries.

**Aliases:** `slk`, `ksl`, `startlottokarma`

---

### Start a Lotto - Additive
**Slash:** `/startlotto prize:<prize> base:<ping|noping> added:true`  
**Prefix:** `!sla <prize>`  
Each entry increases the total prize by the base amount.

**Aliases:** `sla`, `asl`, `startlottoadded`, `slanp`, `anpsl`, `startlottoaddednoping`

---

### Start a Lotto - Karma & Additive
**Slash:** `/startlotto prize:<prize> base:<ping|noping> added:true karma:true`  
**Prefix:** `!slak <prize>`  
Combines karma and additive mechanics.

**Aliases:** `slak`, `slka`, `startlottoaddedkarma`

---

### Start a Lotto - Quick Mode
**Slash:** `/startlotto prize:<prize> base:quick`  
**Prefix:** `!slq <prize>`  
Starts a 20-second quick lotto.

**Aliases:** `slq`, `qsl`, `startlottoquick`

---

### Start a Lotto - Faction Only
**Slash:** `/startlotto prize:<prize> base:<ping|noping> faction:true`  
**Prefix:** `!slf <prize>`  
Faction-only lotto. Only available to members in the same faction.

**Aliases:** `slf`, `fsl`, `startlottofaction`

---

## Utility Commands

- `!rl` / `/replay` â€” Replays the last lotto.  
- `!j` / `/join` â€” Joins an active lotto.  
- `!buy [number]` / `/buy` â€” Buy extra entries for karma lotto.  
- `!multiprize [number]` / `/multiprize` â€” Enable multi prize lotto.  
- `!editprize <prize>` / `/editprize` â€” Edit the current lotto's prize.  
- `!manualsend` â€” Disable auto send line.  
- `!lastcall` / `/lastcall` â€” Ping members during lotto (once per lotto).  
- `!autodraw <time>` / `/autodraw` â€” Set timer to auto draw.  
- `!autocd <entry count>` â€” Auto draw after a number of entries.  
- `!cd` â€” Countdown 15s then draw winner.  
- `!draw` / `/draw` â€” Instantly draw a winner.  
- `!gg` â€” Congratulate the winner and gain karma.  
- `!ty` â€” Thank the lotto runner.  
- `!unlock` â€” Manually unlock lotto.  
- `!minilock` â€” Prevent others from running minigames during a lotto.  
- `!total [@user]` â€” Show lotto and karma stats.  
- `!karma [@user]` â€” Check available karma.  
- `!lastlotto` â€” Show the last lotto winner.  
- `!chk` / `/check` â€” View active lotto details.  

---

## Leaderboards

- `!top [karma|minigame|lotto]` â€” Show top 5 leaderboard.
- `!topten [karma|minigame|lotto]` â€” Show top 10 leaderboard.

---

## Opt-in/Opt-out Commands

- `!pingoptin` / `!pingoptout` â€” Manage lotto ping notifications.
- `!karmaoptin` / `!karmaoptout` â€” Enable or disable karma gain.

---

## Torn API Integration

- `/api` â€” Register Torn API key.
- `/api remove` â€” Remove Torn API key.
- `/api info` â€” Show API system info.
- `!api` â€” Show API usage and data.

---

## Notes

- Prefix and Slash commands are interchangeable.
- Some commands have different behaviors depending on options.
- Only designated lotto runners can execute some actions.

---

## Folder Structure

```
commands/
â””â”€â”€ lotto/
    â”œâ”€â”€ start.js
    â”œâ”€â”€ join.js
    â”œâ”€â”€ draw.js
    â”œâ”€â”€ replay.js
    â”œâ”€â”€ multiprize.js
    â”œâ”€â”€ editprize.js
    â”œâ”€â”€ totals.js
    â”œâ”€â”€ leaderboard.js
    â””â”€â”€ ...
```

This module powers one of the core features of KieBot â€” server-based lottos tied to Torn City's community dynamics.

---

For any questions or feature requests, contact the devs or check the KieBot documentation.
