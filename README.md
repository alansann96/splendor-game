# Arcane Essences — online with friends

React + Vite implementation of an arcane-themed essence-trading engine-builder. Solo vs AI (easy/medium/hard) or online with 2–4 players using Firebase Realtime Database for state sync.

> Inspired by the gem-trading engine-builder genre. Not affiliated with, endorsed by, or derived from any commercial product.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Solo mode works out of the box. **Online rooms require Firebase setup** below.

## Online setup (Firebase Realtime Database)

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. Name it (e.g. `splendor-game`). Disable Google Analytics — you don't need it.

### 2. Enable Realtime Database

1. In the project, sidebar → **Build → Realtime Database** → **Create Database**.
2. Pick a location close to you (e.g. `us-central1`).
3. Start in **test mode** (anyone can read/write — fine for a friends-only game; tighten later if you want).

### 3. Register a Web app and copy config

1. Project Overview → click the `</>` (web) icon → **Register app** → name it `splendor-web`.
2. Firebase shows a `firebaseConfig` snippet. You only need these four values:
   - `apiKey`
   - `authDomain`
   - `databaseURL`  ← **must be present** (RTDB URL, ends in `.firebaseio.com` or `.firebasedatabase.app`)
   - `projectId`

### 4. Paste into `.env.local`

```bash
cp .env.example .env.local
```

Fill in `.env.local` with the four values:

```
VITE_FB_API_KEY=AIzaSy...
VITE_FB_AUTH_DOMAIN=splendor-game.firebaseapp.com
VITE_FB_DB_URL=https://splendor-game-default-rtdb.firebaseio.com
VITE_FB_PROJECT_ID=splendor-game
```

Restart `npm run dev` so Vite picks up the env vars.

The lobby's "Create Online Room" and "Join Online Room" buttons should now be enabled.

### 5. (Optional) Tighten the RTDB rules

Test mode lets anyone read/write the entire DB. To restrict to just `/rooms` and auto-cleanup old rooms, paste into **Realtime Database → Rules**:

```json
{
  "rules": {
    "rooms": {
      "$code": {
        ".read": true,
        ".write": true,
        ".validate": "$code.matches(/^[A-Z0-9]{4}$/)"
      }
    }
  }
}
```

This is still wide open inside a room (any client can write) — fine for a friends-only game. Lock further if you care about anti-griefing.

## Deploy to Vercel

1. Push the repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. **Environment Variables**: add the same four `VITE_FB_*` vars from `.env.local` (Vercel reads them at build time).
4. Click **Deploy**. Vercel autodetects Vite.
5. Share the resulting URL — friends visit, you pick "Create Room", paste the 4-letter code in chat, they pick "Join Room".

## How online play works

- Each game = one room keyed by a 4-letter code (e.g. `ABCD`)
- Room state lives at `/rooms/CODE/state` in RTDB — a single JSON object
- All clients subscribe via `onValue`; whoever's turn it is mutates the state and writes it back
- AI moves run on the **host's** client (whoever created the room) — no server needed
- If the host's tab closes, AI turns stall. Refresh-and-rejoin isn't supported in this version (quick-hack scope)

## Project structure

```
splendor.jsx           # Game logic + game UI (single component)
src/App.jsx            # Lobby, waiting room, online glue
src/firebase.js        # Firebase init from env vars
src/useRoom.js         # Realtime DB hook + helpers (publish/fetch/code gen)
src/main.jsx           # React entrypoint
.env.example           # Template for .env.local
```

## Game features

- 2–4 players (4/5/7 essences per color for 2/3/4 players, N+1 archmages)
- Solo vs AI with three difficulty levels:
  - **Easy** — random valid moves
  - **Medium** — heuristic (target a card, gather its gems, buy)
  - **Hard** — enumerates candidate moves, evaluates 1-ply ahead
- AI bots can fill empty slots in online rooms too
- 15-point win, final-round trigger, archmage tiles, aurum (wild) tokens on reserve
