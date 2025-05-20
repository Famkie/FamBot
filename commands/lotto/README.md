commands/lotto/ - KieBot Lotto Command Suite

This folder contains all commands related to the Lotto system in KieBot.
Lotto is one of KieBot’s core features, allowing users to host interactive prize draws on Discord with hybrid command support (both prefix ! and slash /).


---

Key Features

Hybrid commands (! and /) for maximum flexibility

Supports various lotto modes: Ping, No Ping, Quick, Karma, Additive, Faction Only

Karma system rewarding positive participation

Torn API integration for auto send line

Full leaderboard and stats tracking (karma, minigame, total lotto)

Full host control: edit prize, countdowns, auto draw, and more



---

Command Structure and Descriptions

1. Start a Lotto

Command: !sl, /startlotto

Required Params: prize:<prize>, base:<ping|noping|quick>

Optional Flags:

added:true → Additive Lotto (prize increases with entries)

karma:true → Karma Lotto (users can buy extra entries)

faction:true → Faction-only Lotto



Examples:

/startlotto prize:500k base:ping karma:true added:true
!sl 500k


---

2. Special Lotto Variants

Variant	Alias	Description

No Ping	!slnp	Lotto without ping
Karma	!slk	Lotto with karma system
Additive	!sla	Prize increases per entry
Karma + Additive	!slak	Combination of karma & additive
Quick	!slq	Fast lotto (20 seconds, no ping)
Faction Only	!slf	Restricted to faction members only



---

3. Participation & Control

Function	Command	Description

Join Lotto	!j, /join	Join an active lotto
Buy Extra Entry	!buy	Buy extra entries in Karma Lotto
Replay Lotto	!rl, /replay	Replay the previous lotto
Multi-prize Setting	!multiprize	Set number of send lines
Edit Prize	!editprize	Change prize during active lotto
Manual Send Line	!manualsend	Disable Torn API auto-send
Last Call Reminder	!lastcall	Ping participants as reminder
Auto Draw	!autodraw	Schedule automatic draw
Auto CD by Entry	!autocd	Auto draw once enough entries exist
Countdown to Draw	!cd	15-second countdown before drawing
Draw Now	!draw	Draw the winner immediately
GG (Congratulate)	!gg	Congratulate winner and give karma
Thank the Runner	!ty	Thank lotto host from the winner
Unlock Lotto	!unlock	Re-open a locked lotto
Lock Minigames	!minilock	Prevent others from starting minigames



---

4. Stats & Leaderboard

Function	Command	Description

Check Lotto Status	!chk, /check	View current lotto details
Lotto Total Info	!total	Total prize and karma generated
Karma Info	!karma	Check a user’s karma points
Last Winner Info	!lastlotto	See the most recent lotto winner
Top 5 Leaderboard	!top	View Top 5 leaderboard
Top 10 Leaderboard	!topten	View Top 10 leaderboard



---

5. User Preferences (Opt In / Out)

Function	Command	Description

Ping Opt-In	!pingoptin	Enable ping when lotto starts
Ping Opt-Out	!pingoptout	Disable lotto pings
Karma Opt-In	!karmaoptin	Enable Karma participation
Karma Opt-Out	!karmaoptout	Disable Karma features



---

6. Torn API Integration

Function	Command	Description

Add API Key	/api	Add Torn API key for auto send line
Remove API Key	/api remove	Remove Torn API key
API Info	/api info	Show current API key status
API Usage	!api	View usage statistics of Torn API



---

Quick Usage Examples

!sl 1m                 # Basic ping lotto
!slk 500k             # Karma lotto
/startlotto prize:2m base:noping karma:true
!sla 250k             # Additive lotto
!buy 3                # Buy 3 extra entries
!draw                 # Draw winner now
!top                  # View leaderboard


---

Developer Notes

Each command is split into its own file for modularity

Commands are auto-registered via a handler

Slash commands are auto-deployed when bot starts

.env file is used to store tokens and API keys securely


