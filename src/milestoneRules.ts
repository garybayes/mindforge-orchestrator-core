import { OrchestratorConfig } from "./types";

/**
 * Simple milestone inference:
 * - If track is "sprint" and a sprint_pattern exists, fill it with "1.0" by default.
 * - You can later update this to consult repo milestones to find the active sprint.
 */
export function inferMilestoneTitle(
  config: OrchestratorConfig,
  track: string | null
): string | null {
  if (!track) return null;

  if (track === "sprint" && config.milestones?.sprint_pattern) {
    const pattern = config.milestones.sprint_pattern;
    return pattern.replace("{major}", "1").replace("{minor}", "0");
  }

  return null;
}
