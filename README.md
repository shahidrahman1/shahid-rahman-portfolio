# Shahid Rahman — Portfolio

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react · next/font.
The page loads empty and robot cursors build it live.

## Run it locally

You need **Node.js 18.18+** (20 or 22 recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To test the production build:

```bash
npm run build
npm start
```

## Deploy free on Vercel

1. Create a free account at https://github.com and a new **empty** repository (e.g. `portfolio`).
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
3. Go to https://vercel.com, sign up with GitHub (Hobby plan is free).
4. **Add New → Project**, pick the `portfolio` repo, click **Deploy**. Vercel detects Next.js; no settings needed.
5. You get a `*.vercel.app` URL in about a minute. Every `git push` redeploys automatically.
6. Optional: **Project → Settings → Domains** to connect your own domain.

No-Git alternative: `npm i -g vercel` then run `vercel` in this folder and follow the prompts.

## Editing content

All text lives in **`lib/content.ts`** — name, email, LinkedIn, stats, projects, timeline,
skills and principles. Change it there; the whole site updates.

- `profile.location` is set to `"Pakistan"` because the resume lists no city. Change it to your city.
- Project cards show **Live site** / **Code** buttons only if you add `liveUrl` / `codeUrl`.
- The phone number is intentionally not used anywhere.
- Replace `public/headshot.png` to change the photo (transparent PNG works best).

## The build animation

| Control | What it does |
| --- | --- |
| **Pause** / `P` | Freeze / resume the agents |
| **Agents** / `A` | Turn off (everything appears instantly) or on (replays the build). Saved in localStorage |
| **Tour** / `T` | Reloads, waits for the hero to build, then slowly auto-scrolls the site. Scroll or `Esc` to stop |
| `?agents=on` | Force the animation even with reduced motion turned on |
| `?agents=off` | Disable the animation |

Mark any element with `data-build="type"`, `"pop"` or `"wipe"` to have the agents build it.
Don't nest `data-build` elements.

How it works:
- `lib/agents/config.ts` has the agent names and colors, plus the `<head>` script that adds `build-mode` before first paint so nothing flashes.
- `lib/agents/engine.ts` runs one requestAnimationFrame loop and an IntersectionObserver.
- `lib/agents/tour.ts` handles the auto-scroll.
- `components/agents/` holds the dock, boot loader and the React glue.

## Structure

```
app/            layout (fonts, head script), page, globals.css, icon
components/     sections/ (Hero, Work, Stack, Record, About, Contact), agents/, ui
lib/            content.ts, agents/
public/         headshot.png
```
