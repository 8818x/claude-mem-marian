import { z } from 'zod';
import { parseAgentXml } from '../../sdk/parser.js';

const batchResponse = z.object({
  results: z.array(z.object({ id: z.number().int(), xml: z.string() }).strict()),
}).strict();

/** Validate the entire envelope before any item can reach persistence. */
export function parseOpenRouterObservationBatch(text: string, ids: number[]): string[] | null {
  try {
    const unfenced = text.trim().replace(/^```json\s*\n([\s\S]*?)\n```$/i, '$1');
    const { results } = batchResponse.parse(JSON.parse(unfenced));
    if (results.length !== ids.length || new Set(results.map(result => result.id)).size !== ids.length) return null;
    const byId = new Map(results.map(result => [result.id, result.xml.trim()]));
    const ordered: string[] = [];
    for (const id of ids) {
      const xml = byId.get(id);
      if (!xml) return null;
      const blocks = xml.match(/<observation>[\s\S]*?<\/observation>/g) ?? [];
      const isSkip = /^<skip_summary(?:\s+reason="[^"]*")?\s*\/>$/.test(xml);
      // The normal parser salvages partial XML. A batch must not acknowledge a
      // truncated second record or mistake an embedded skip for the whole item.
      if (!isSkip && (!blocks.length || xml.replace(/<observation>[\s\S]*?<\/observation>/g, '').trim())) return null;
      const parsed = parseAgentXml(xml);
      if (!parsed.valid || (!isSkip && (parsed.summary || parsed.observations.length !== blocks.length
        || parsed.observations.some(observation => !observation.title?.trim())))) return null;
      ordered.push(xml);
    }
    return ordered;
  } catch {
    return null;
  }
}
