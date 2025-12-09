import { OrchestratorConfig } from "./types";

export function isStale(
  config: OrchestratorConfig,
  lastUpdated: string,
  labels: string[]
): boolean {
  if (!config.stale?.enabled) return false;

  const exclude = config.stale.exclude_labels;
  if (labels.some((l) => exclude.includes(l))) return false;

  const last = new Date(lastUpdated).getTime();
  const now = Date.now();

  const ageDays = (now - last) / (1000 * 60 * 60 * 24);

  return ageDays >= config.stale.days_until_stale;
}
