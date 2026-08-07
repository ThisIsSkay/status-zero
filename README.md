# Status Zero

Status Zero is a live public dashboard for monitoring the official service status of ChatGPT, Claude, Grok, Microsoft Copilot, GitHub Copilot, and Mistral Le Chat.

## Open the dashboard

**[Launch Status Zero](https://thisisskay.github.io/status-zero/)**

## Live dashboard

The public GitHub Pages site is served from `index.html`. It reads each provider's official status feed directly in the browser and refreshes automatically every 60 seconds.

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
- xAI (Grok): `https://status.x.ai/grok-com/summary.json`
- Microsoft (Copilot): `https://copilot.statuspage.io/api/v2/summary.json`
- GitHub (Copilot): `https://www.githubstatus.com/api/v2/summary.json`
- Mistral AI (Le Chat): `https://status.mistral.ai/summary.json`

Status Zero is an independent monitor and is not affiliated with OpenAI, Anthropic, xAI, Microsoft, GitHub, or Mistral AI.