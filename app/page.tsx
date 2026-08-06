"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ComponentStatus = { name: string; status: string };
type ProviderStatus = { id: "openai" | "claude"; name: string; product: string; indicator: string; description: string; updatedAt: string | null; components: ComponentStatus[]; statusUrl: string; error?: boolean };
type StatusResponse = { providers: ProviderStatus[]; checkedAt: string };

const FALLBACK: StatusResponse = {
  checkedAt: new Date().toISOString(),
  providers: [
    { id: "openai", name: "ChatGPT", product: "OpenAI", indicator: "unknown", description: "Peeking behind the curtain…", updatedAt: null, components: [], statusUrl: "https://status.openai.com/" },
    { id: "claude", name: "Claude", product: "Anthropic", indicator: "unknown", description: "Listening for a heartbeat…", updatedAt: null, components: [], statusUrl: "https://status.claude.com/" },
  ],
};

const mood = (indicator: string) => {
  if (indicator === "none") return { label: "All sparkly", face: "◕‿◕", note: "The tiny servers are humming a happy tune.", className: "healthy" };
  if (indicator === "minor" || indicator === "maintenance") return { label: "A little wobbly", face: "◕﹏◕", note: "Some magic may arrive by scenic route.", className: "warning" };
  if (indicator === "major" || indicator === "critical") return { label: "Having a moment", face: "⊙﹏⊙", note: "The gremlins are being escorted out.", className: "danger" };
  return { label: "Cloudy signal", face: "◔_◔", note: "The official lookout is hiding in the clouds.", className: "unknown" };
};
const componentLabel = (status: string) => status === "operational" ? "Good" : status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatTime = (date: string | null) => !date ? "Waiting for news" : new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }).format(new Date(date));

export default function Home() {
  const [data, setData] = useState<StatusResponse>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(60);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error("Status fetch failed");
      setData(await response.json());
      setTick(60);
    } catch {
      setData((current) => ({ ...current, checkedAt: new Date().toISOString(), providers: current.providers.map((provider) => ({ ...provider, indicator: "unknown", description: "The official lookout is hiding in the clouds.", error: true })) }));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    refresh();
    const refreshTimer = window.setInterval(refresh, 60_000);
    const countdownTimer = window.setInterval(() => setTick((value) => value <= 1 ? 60 : value - 1), 1_000);
    return () => { window.clearInterval(refreshTimer); window.clearInterval(countdownTimer); };
  }, [refresh]);
  const overall = useMemo(() => {
    const indicators = data.providers.map((provider) => provider.indicator);
    if (indicators.some((value) => value === "major" || value === "critical")) return "Storm clouds spotted";
    if (indicators.some((value) => value === "minor" || value === "maintenance")) return "Mostly magical, slightly wobbly";
    if (indicators.every((value) => value === "none")) return "The magic is wide awake";
    return "Checking the enchanted wires";
  }, [data.providers]);

  return (
    <main>
      <div className="sky-decor sky-decor-one" /><div className="sky-decor sky-decor-two" />
      <div className="star-field" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>·</span></div>
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Status Zero home"><span className="brand-mark">✦</span><span>Status Zero<small>Monitoring digital signals</small></span></a>
        <div className="live-pill"><span className="live-dot" />Live official signals</div>
      </nav>
      <section className="hero" id="top">
        <div className="sidekick sidekick-left" aria-hidden="true"><em>✧</em>beep!</div>
        <div className="sidekick sidekick-right" aria-hidden="true"><em>✦</em>boop!</div>
        <div className="eyebrow">Today’s enchanted forecast</div>
        <h1>Are the robots<br />feeling chatty?</h1>
        <p className="hero-copy">A pocket-sized weather station for checking whether ChatGPT and Claude are awake, dreaming, or staging a tiny dramatic outage.</p>
        <div className="forecast-note"><span />High chance of clever conversations</div>
        <div className="overall-status" role="status" aria-live="polite"><span className="overall-icon">☀</span><span><small>Right this minute</small><strong>{overall}</strong></span></div>
      </section>
      <div className="forecast-ribbon" aria-hidden="true"><span>Live signals</span><i>✦</i><span>Tiny servers</span><i>✦</i><span>Zero crystal balls</span><i>✦</i><span>Fresh every 60 seconds</span></div>
      <section className="status-grid" aria-label="AI service status">
        {data.providers.map((provider, index) => {
          const currentMood = mood(provider.indicator);
          const affected = provider.components.filter((component) => component.status !== "operational");
          return (
            <article className={`status-card ${provider.id} ${currentMood.className}`} key={provider.id}>
              <span className="card-number" aria-hidden="true">FORECAST 0{index + 1}</span>
              <div className="card-sparkles" aria-hidden="true">✦ · ✧</div>
              <header className="card-header"><div><span className="provider">{provider.product} constellation</span><h2>{provider.name}</h2></div><div className="mascot" aria-hidden="true"><span className="antenna" /><div className="face">{currentMood.face}</div></div></header>
              <div className="status-banner"><span className="status-orb" /><div><strong>{currentMood.label}</strong><p>{currentMood.note}</p></div></div>
              <div className="component-list">{provider.components.length ? provider.components.map((component) => (
                <div className="component" key={component.name}><span>{component.name}</span><span className={`component-state ${component.status}`}><i />{componentLabel(component.status)}</span></div>
              )) : <div className="component placeholder"><span>Official signal</span><span>Looking…</span></div>}</div>
              <footer className="card-footer"><span>{affected.length ? `${affected.length} affected ${affected.length === 1 ? "service" : "services"}` : `Last whisper ${formatTime(provider.updatedAt)}`}</span><a href={provider.statusUrl} target="_blank" rel="noreferrer">Visit official lookout <span aria-hidden="true">↗</span></a></footer>
            </article>
          );
        })}
      </section>
      <section className="refresh-panel">
        <div className="telescope" aria-hidden="true"><span className="telescope-lens" /><span className="telescope-body" /><span className="telescope-leg telescope-leg-left" /><span className="telescope-leg telescope-leg-right" /></div>
        <div><span className="panel-kicker">The midnight lookout</span><h3>We peek through the telescope every minute.</h3><p>Last checked {formatTime(data.checkedAt)} · Next stargaze in {tick}s</p></div>
        <button onClick={refresh} disabled={loading}><span className={loading ? "spin" : ""}>↻</span>{loading ? "Consulting stars…" : "Peek again"}</button>
      </section>
      <footer className="site-footer"><span>Made with curiosity, tea, and several cooperative stardust particles.</span><span>Official data from OpenAI &amp; Anthropic</span></footer>
    </main>
  );
}