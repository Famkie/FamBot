# 'KieBot Lotto Command Suiteʼ

**This folder contains all commands related to the Lotto system in KieBot.**  
Lotto is one of KieBot's core features, enabling interactive prize giveaways on Discord with hybrid command support (both prefix `!` and slash `/`).

## Key Features
- Hybrid commands (`!` and `/`) for maximum flexibility
- Multiple lotto modes: Ping, No Ping, Quick, Karma, Additive, Faction Only
- Karma system to reward positive participation
- Torn API integration for automatic send line
- Full leaderboard and stats system (karma, minigames, total lotto)
- Full host control: edit prize, countdown, auto draw, and more

## Command Structure & Explanation

### 1. Start a Lotto
- **Command**: `!sl`, `/startlotto`
- **Required Params**: `prize:<prize>`, `base:<ping|noping|quick>`
- **Optional Flags**:
  - `added:true` â†’ Additive Lotto (prize increases per entry)
  - `karma:true` â†’ Karma Lotto (extra entries purchasable)
  - `faction:true` â†’ Faction-only lotto

**Example**:
```
/startlotto prize:500k base:ping karma:true added:true
!sl 500k
```

### 2. Special Lotto Variants
| Variant           | Alias     | Description                            |
|------------------|-----------|----------------------------------------|
| No Ping          | `!slnp`   | Lotto without ping                     |
| Karma            | `!slk`    | Lotto with karma system                |
| Additive         | `!sla`    | Prize increases per entry              |
| Karma + Additive | `!slak`   | Combo of karma & additive              |
| Quick            | `!slq`    | Fast 20-sec lotto                      |
| Faction Only     | `!slf`    | Lotto for faction members only        |

### 3. Participation & Control
| Function              | Command       | Description                             |
|-----------------------|---------------|-----------------------------------------|
| Join Lotto            | `!j`, `/join` | Enter the current lotto                 |
| Buy Entry (Karma)     | `!buy`        | Buy extra entries in karma lotto        |
| Replay Lotto          | `!rl`, `/replay` | Replay the last lotto                |
| Multiprize            | `!multiprize` | Set amount of send line to issue       |
| Edit Prize            | `!editprize`  | Edit the prize while lotto is active   |
| Manual Send Line      | `!manualsend` | Disable auto send line from Torn API   |
| Last Call             | `!lastcall`   | Ping reminder for participants          |
| Auto Draw             | `!autodraw`   | Schedule automatic draw                 |
| Auto CD by Entry      | `!autocd`     | Auto draw when enough entries exist    |
| Countdown             | `!cd`         | 15-second countdown then draw           |
| Draw Now              | `!draw`       | Draw immediately                        |
| GG (Congratulate)     | `!gg`         | Congratulate and reward karma           |
| Thank Runner          | `!ty`         | Thank the host from the winner          |
| Unlock Lotto          | `!unlock`     | Unlock locked lotto                     |
| Lock Minigame         | `!minilock`   | Prevent others from running minigames  |

### 4. Stats & Leaderboard
| Function             | Command         | Description                             |
|----------------------|------------------|-----------------------------------------|
| Check Lotto Status   | `!chk`, `/check` | Details of current lotto               |
| Total Lotto Stats    | `!total`         | Total prizes and karma awarded         |
| Karma Info           | `!karma`         | View userâ€™s karma                       |
| Last Winner          | `!lastlotto`     | View last lotto winner                  |
| Top 5 Leaderboard    | `!top`           | View top 5 leaderboard                  |
| Top 10 Leaderboard   | `!topten`        | Same as `!top` but with top 10          |

### 5. User Preferences (Opt In/Out)
| Function         | Command          | Description                             |
|------------------|------------------|-----------------------------------------|
| Ping Opt In      | `!pingoptin`     | Enable ping notifications               |
| Ping Opt Out     | `!pingoptout`    | Disable ping notifications              |
| Karma Opt In     | `!karmaoptin`    | Enable karma participation              |
| Karma Opt Out    | `!karmaoptout`   | Disable karma participation             |

### 6. Torn API Integration
| Function           | Command        | Description                             |
|--------------------|----------------|-----------------------------------------|
| Add API            | `/api`         | Add API key for auto send line          |
| Remove API         | `/api remove`  | Remove API key                          |
| API Info           | `/api info`    | View API system info                    |
| API Usage          | `!api`         | View current API usage stats            |

## Quick Usage Examples
```
!sl 1m               # Regular ping lotto
!slk 500k           # Karma lotto
/startlotto prize:2m base:noping karma:true
!sla 250k           # Additive lotto
!buy 3              # Buy 3 extra entries
!draw               # Draw winner immediately
!top                # View leaderboard
```

## Developer Notes
- Each command is stored in its own modular file
- Command handler auto-registers everything
- Slash commands deploy automatically on bot start
- Uses `.env` for storing tokens and API keys
