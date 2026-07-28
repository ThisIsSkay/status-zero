import { NextResponse } from "next/server";

type StatusComponent = { name: string; status: string };
type StatusPayload = { page?: { updated_at?: string }; status?: { indicator?: string; description?: string }; components?: StatusComponent[] };
const sources = [
  { id: "openai" as const, name: "ChatGPT", product: "OpenAI", endpoint: "https://status.openai.com/api/v2/summary.json", statusUrl: "https://status.openai.com/", componentNames: ["Conversations", "Login", "Search", "GPTs"] },
  { id: "claude" as const, name: "Claude", product: "Anthropic", endpoint: "https://status.claude.com/api/v2/summary.json", statusUrl: "https://status.claude.com/", componentNames: ["claude.ai", "Claude API (api.anthropic.com)", "Claude Code"] },
];
export const dynamic = "force-dynamic";
export async function GET() {
  const providers = await Promise.all(sources.map(async (source) => {
    try {
      const response = await fetch(source.endpoint, { cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Status source returned ${response.status}`);
      const payload = await response.json() as StatusPayload;
      const allComponents = payload.components ?? [];
      const components = source.componentNames.map((name) => allComponents.find((component) => component.name === name)).filter((component): component is StatusComponent => Boolean(component));
      return { id: source.id, name: source.name, product: source.product, indicator: payload.status?.indicator ?? "unknown", description: payload.status?.description ?? "Status unavailable", updatedAt: payload.page?.updated_at ?? null, components: components.slice(0, 4), statusUrl: source.statusUrl };
    } catch {
      return { id: source.id, name: source.name, product: source.product, indicator: "unknown", description: "Official status unavailable", updatedAt: null, components: [], statusUrl: source.statusUrl, error: true };
    }
  }));
  return NextResponse.json({ providers, checkedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
