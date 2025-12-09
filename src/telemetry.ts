import fs from "fs";
import path from "path";
import { TelemetryPayload } from "./types";

export function writeTelemetry(
  basePath: string,
  issueNumber: number,
  payload: TelemetryPayload
): string {
  const eventsDir = path.join(basePath, "events");
  fs.mkdirSync(eventsDir, { recursive: true });

  const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${issueNumber}-${safeTimestamp}.json`;
  const fullPath = path.join(eventsDir, fileName);

  fs.writeFileSync(fullPath, JSON.stringify(payload, null, 2), "utf8");

  return fullPath;
}
