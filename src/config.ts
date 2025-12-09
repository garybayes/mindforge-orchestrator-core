import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { OrchestratorConfig } from "./types";

export function loadConfig(configPath: string): OrchestratorConfig {
  const fullPath = path.resolve(process.cwd(), configPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Configuration file not found: ${fullPath}`);
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const doc = yaml.load(raw) as OrchestratorConfig;

  if (!doc || typeof doc !== "object") {
    throw new Error("Invalid orchestrator.yml file format.");
  }

  if (!("version" in doc)) {
    throw new Error("Config missing 'version' field.");
  }

  if (doc.version !== 1) {
    throw new Error(`Unsupported config version: ${doc.version}`);
  }

  if (!Array.isArray(doc.tracks) || doc.tracks.length === 0) {
    throw new Error("Config must define at least one track.");
  }

  return doc;
}
