# Status Zero

Status Zero is a live public dashboard for monitoring the official service status of ChatGPT, Claude, Microsoft Copilot, GitHub Copilot, Cursor, Groq, ElevenLabs, and Cohere.

## Open the dashboard

**[Launch Status Zero](https://thisisskay.github.io/status-zero/)**

## Live dashboard

The public GitHub Pages site is served from `index.html`. It reads each provider's official status feed directly in the browser and refreshes automatically every 60 seconds.

Eight services are tracked: ChatGPT, Claude, Microsoft Copilot, GitHub Copilot,
Cursor, Groq, ElevenLabs, and Cohere. Every one is confirmed readable from the
browser; providers that cannot be read are not listed at all, rather than
carried as entries that permanently report nothing.

A provider that fails to answer on a given poll is therefore a genuine blip, not
a standing gap. It drops to a compact link beneath the cards for that cycle and
is excluded from the overall verdict — a feed we could not fetch says nothing
about that provider's health and must never be reported as an outage. The banner
counts them, and reports "Unable to check" only when no feed at all could be
read.

The page renders entirely in lowercase, including component and incident names
that arrive from the feeds.

Each card lists up to four components, and **anything not operational sorts
first**, so an outage buried far down a long component list still surfaces. The
per-provider `components` list is only a preference for the remaining slots — a
component the provider renames costs its position rather than vanishing
silently and leaving a short card.

It also surfaces incidents and maintenance reported by the feeds, with a link to
the relevant incident page. Only events that are actually happening qualify:
unresolved incidents, and maintenance whose status is `in_progress` or
`verifying`. Work merely *scheduled* for later is deliberately excluded — some
providers publish maintenance per model and per region, which would otherwise
keep future, single-model events permanently parked above every service on the
page. That section renders nothing when nothing is going on. The browser tab's favicon and title track
the overall status too, so a pinned tab shows green, amber, or red at a glance.

## Standalone dashboards

- `Status Zero.html` — professional deep-black operations dashboard
- `Status Zero Whimsical.html` — playful storybook dashboard

Both files can be opened directly in a browser without installing anything. Internet access is required for live status updates.

## Full app

The repository also includes a vinext/React implementation under `app/`.

### Requirements

- Node.js 22.13 or newer
- pnpm

### Local development

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

### Validation

```bash
pnpm run build
pnpm test
```

## Data sources

- OpenAI (ChatGPT): `https://status.openai.com/api/v2/summary.json`
- Anthropic (Claude): `https://status.claude.com/api/v2/summary.json`
- Microsoft (Copilot): `https://copilot.statuspage.io/api/v2/summary.json`
- GitHub (Copilot): `https://www.githubstatus.com/api/v2/summary.json`
- Anysphere (Cursor): `https://status.cursor.com/api/v2/summary.json`
- Groq: `https://groqstatus.com/api/v2/summary.json`
- ElevenLabs: `https://status.elevenlabs.io/api/v2/summary.json`
- Cohere: `https://status.cohere.com/api/v2/summary.json`

All run on Atlassian Statuspage, which serves its `summary.json` with
permissive CORS headers — a hard requirement here, since this is a static site
that fetches directly from the visitor's browser with no backend to proxy
through.

### Providers that were tried and removed

Each of these was added, observed failing in the browser, and removed. They are
listed here so the same URLs are not guessed at again:

- **Grok** (`status.x.ai`) and **Le Chat** (`status.mistral.ai`) run on Instatus,
  which does not serve status JSON cross-origin. Mistral's endpoint returns no
  `Access-Control-Allow-Origin` header, and xAI blocks its JSON endpoints
  outright, publishing only an RSS feed at `status.x.ai/feed.xml` that is subject
  to the same restriction.
- **Gemini** has no Statuspage feed at all. Google publishes status at
  `status.cloud.google.com` in an unrelated format.
- **Perplexity**, **Hugging Face** and **Replicate** never answered on their
  `/api/v2/summary.json` endpoints from the browser.

Adding any of them back would require a server-side proxy (a Worker or
serverless function) to fetch the feed and re-serve it with CORS headers.
Nothing client-side can work around it.

Status Zero is an independent monitor and is not affiliated with OpenAI,
Anthropic, Microsoft, GitHub, Anysphere, Groq, ElevenLabs, or Cohere.