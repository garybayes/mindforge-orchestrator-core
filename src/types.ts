export interface OrchestratorTrackConfig {
  id: string;
  label: string;
  default_milestone_pattern?: string;
}

export interface OrchestratorConfig {
  version: number;
  tracks: OrchestratorTrackConfig[];

  milestones?: {
    sprint_pattern?: string; // e.g. "Sprint {major}.{minor}"
    internal_milestone_label?: string;
    default_sprint_duration_days?: number;
  };

  stale?: {
    enabled: boolean;
    days_until_stale: number;
    days_until_close: number;
    stale_label: string;
    exclude_labels: string[];
  };

  telemetry?: {
    enabled: boolean;
    path: string; // base path for telemetry, e.g. "telemetry"
    dashboard_path: string; // e.g. "dashboard/dashboard.json"
  };

  self_healing?: {
    enabled: boolean;
    normalize_labels: boolean;
    fix_missing_track: boolean;
    fix_missing_milestone: boolean;
  };
}

export interface ClassificationResult {
  track: string | null;
  trackLabelToApply?: string | null;
  violations: string[];
  actions: string[];
}

export interface TelemetryPayload {
  version: number;
  event: string;
  repository: {
    owner: string;
    repo: string;
  };
  issue: {
    id: number;
    number: number;
    title: string;
    state: string;
    labels: string[];
    milestone: string | null;
    created_at: string;
    updated_at: string;
  };
  classification: ClassificationResult;
  generated_at: string;
}
