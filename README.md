# Status Zero

Live status for eight AI services on one page. No accounts, no backend: the
browser reads each vendor's official status feed directly and re-checks every
60 seconds.

**[thisisskay.github.io/status-zero](https://thisisskay.github.io/status-zero/)**

## Tracked services

| Service | Vendor | Status feed |
| --- | --- | --- |
| ChatGPT | OpenAI | [status.openai.com](https://status.openai.com/) |
| Claude | Anthropic | [status.claude.com](https://status.claude.com/) |
| Copilot | Microsoft | [copilot.statuspage.io](https://copilot.statuspage.io/) |
| GitHub Copilot | GitHub | [githubstatus.com](https://www.githubstatus.com/) |
| Cursor | Anysphere | [status.cursor.com](https://status.cursor.com/) |
| Groq | Groq | [groqstatus.com](https://groqstatus.com/) |
| ElevenLabs | ElevenLabs | [status.elevenlabs.io](https://status.elevenlabs.io/) |
| Cohere | Cohere | [status.cohere.com](https://status.cohere.com/) |

Every one serves an Atlassian Statuspage `/api/v2/summary.json` feed with
permissive CORS headers — a hard requirement, since the fetch happens in the
visitor's own browser with nothing in between.

## How it behaves

- **An unreachable feed is not an outage.** It is excluded from the overall
  verdict and drops to a link below the cards; the banner reports "unable to
  check" only when no feed at all could be read.
- **Problems sort first.** Each card lists up to four components with anything
  not operational at the top, so an outage buried far down a long list still
  surfaces.
- **Only live events are headlined.** Unresolved incidents, and maintenance
  that is actually running — work merely scheduled for later is left out, or a
  single model in a single region would sit above every service on the page.
- **The tab carries the verdict.** Favicon and title turn green, amber or red,
  so a pinned tab is readable without opening it.
- Everything renders in lowercase, including names supplied by the feeds.

## Repository layout

| Path | What it is |
| --- | --- |
| `index.html` | The deployed site. Self-contained — no build step, no dependencies. |
| `Status Zero.html` | Byte-identical copy of `index.html`, kept for opening straight off disk. |
| `Status Zero Whimsical.html` | The same dashboard in a more playful style. |
| `app/` | A vinext/React port. Not deployed, and currently tracks only ChatGPT and Claude. |

## Running locally

`index.html` needs nothing — open it in a browser. Internet access is required
for live data.

The `app/` port needs Node 22.13+ and pnpm:

```bash
pnpm install
pnpm run dev                  # http://localhost:3000
pnpm run build && pnpm test
```

## Services that aren't here, and why

Each was added, watched fail in a browser, and removed. They are recorded so the
same endpoints don't get tried a third time.

| Service | Reason |
| --- | --- |
| Grok (`status.x.ai`) | Runs on Instatus; JSON endpoints are blocked outright, leaving only an RSS feed under the same restriction. |
| Le Chat (`status.mistral.ai`) | Runs on Instatus; the endpoint returns no `Access-Control-Allow-Origin` header. |
| Gemini | No Statuspage feed exists. Google publishes to `status.cloud.google.com` in an unrelated format. |
| Perplexity, Hugging Face, Replicate | `/api/v2/summary.json` never answered from the browser. |

Restoring any of them would take a server-side proxy — a Worker or serverless
function that refetches the feed and re-serves it with CORS headers. Nothing
client-side can work around it.

---

Status Zero is an independent monitor and is not affiliated with any vendor
listed here.
