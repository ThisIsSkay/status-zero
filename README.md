# Status Zero

Status Zero is a live public dashboard for monitoring the official service status of ChatGPT, Claude, Microsoft Copilot, and GitHub Copilot.

## Open the dashboard

**[Launch Status Zero](https://thisisskay.github.io/status-zero/)**

## Live dashboard

The public GitHub Pages site is served from `index.html`. It reads each provider's official status feed directly in the browser and refreshes automatically every 60 seconds.

Twelve services are tracked: ChatGPT, Claude, Microsoft Copilot, GitHub Copilot,
Perplexity, Cursor, Mistral, Hugging Face, Groq, Replicate, ElevenLabs, and
Cohere. Each must publish an Atlassian Statuspage `/api/v2/summary.json` feed,
since the page reads them straight from the browser with no backend.

A feed the browser cannot reach says nothing about that provider's health, so it
is shown as a muted "Unavailable" card and excluded from the overall verdict
rather than counted as an outage. The banner notes how many feeds were
unreachable, and reports "Unable to check" only when none could be read.

It also surfaces any active incidents and scheduled maintenance reported by the
feeds, with a link to the relevant incident page. That section renders nothing
when every provider is operational. The browser tab's favicon and title track
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

All four run on Atlassian Statuspage, which serves its `summary.json` with
permissive CORS headers — a hard requirement here, since this is a static site
that fetches directly from the visitor's browser with no backend to proxy
through.

### Why Grok and Le Chat aren't listed

Both were tried and removed. xAI (`status.x.ai`) and Mistral AI
(`status.mistral.ai`) both run on Instatus, which does not serve status JSON
cross-origin: Mistral's endpoint returns no `Access-Control-Allow-Origin`
header, and xAI blocks its JSON endpoints outright, publishing only an RSS
feed at `status.x.ai/feed.xml` that is subject to the same restriction.

Adding either one back would require a server-side proxy (a Worker or
serverless function) to fetch the feed and re-serve it with CORS headers.
Nothing client-side can work around it.

Status Zero is an independent monitor and is not affiliated with OpenAI,
Anthropic, Microsoft, or GitHub.