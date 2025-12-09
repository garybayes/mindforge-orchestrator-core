import * as core from "@actions/core";
import * as github from "@actions/github";

import { loadConfig } from "./config";
import { createOctokit } from "./githubClient";
import { classifyIssue } from "./issueClassifier";
import { inferMilestoneTitle } from "./milestoneRules";
import { ensureMilestone, attachMilestoneToIssue } from "./milestoneManager";
import { writeTelemetry } from "./telemetry";
import { TelemetryPayload } from "./types";

async function run() {
  try {
    core.info("🚀 Orchestrator Core starting");

    const configPath = core.getInput("config-path") || ".github/orchestrator.yml";
    const config = loadConfig(configPath);

    const ctx = github.context;
    const issue = ctx.payload.issue;

    if (!issue) {
      throw new Error("This action must be triggered by an issue event.");
    }

    const { owner, repo } = ctx.repo;
    const octokit = createOctokit();

    core.info(`🔍 Processing issue #${issue.number} in ${owner}/${repo}`);

    // 1. Classify issue track
    const classification = classifyIssue(config);
    core.info(`Track: ${classification.track ?? "none"}`);
    if (classification.violations.length > 0) {
      core.info(`Violations: ${classification.violations.join(", ")}`);
    }

    // 2. Self-healing: apply track label if missing
    const selfHealingEnabled = config.self_healing?.enabled ?? false;
    const fixMissingTrack = config.self_healing?.fix_missing_track ?? false;

    if (
      selfHealingEnabled &&
      fixMissingTrack &&
      classification.trackLabelToApply
    ) {
      core.info(`Applying missing track label: ${classification.trackLabelToApply}`);
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: issue.number,
        labels: [classification.trackLabelToApply]
      });
    }

    // 3. Milestone enforcement
    const fixMissingMilestone = config.self_healing?.fix_missing_milestone ?? false;
    let finalMilestoneTitle: string | null = null;

    if (selfHealingEnabled && fixMissingMilestone) {
      const currentMilestoneTitle = issue.milestone?.title ?? null;
      const desiredMilestoneTitle = inferMilestoneTitle(config, classification.track);

      if (desiredMilestoneTitle && currentMilestoneTitle !== desiredMilestoneTitle) {
        core.info(`Desired milestone: ${desiredMilestoneTitle}`);

        const milestoneNumber = await ensureMilestone(octokit, { owner, repo }, desiredMilestoneTitle);
        await attachMilestoneToIssue(octokit, { owner, repo }, issue.number, milestoneNumber);

        finalMilestoneTitle = desiredMilestoneTitle;
        classification.actions.push(`set-milestone:${desiredMilestoneTitle}`);
      } else {
        finalMilestoneTitle = currentMilestoneTitle;
      }
    } else {
      finalMilestoneTitle = issue.milestone?.title ?? null;
    }

    // 4. Telemetry
    const telemetryEnabled = config.telemetry?.enabled ?? true;
    let telemetryPathUsed: string | null = null;

    if (telemetryEnabled) {
      const basePath = config.telemetry?.path ?? "telemetry";

      const labels = (issue.labels || []).map((l: any) =>
        typeof l === "string" ? l : l.name
      );

      const payload: TelemetryPayload = {
        version: 1,
        event: "issue_event",
        repository: {
          owner,
          repo
        },
        issue: {
          id: issue.id,
          number: issue.number,
          title: issue.title,
          state: issue.state,
          labels,
          milestone: finalMilestoneTitle,
          created_at: issue.created_at,
          updated_at: issue.updated_at
        },
        classification,
        generated_at: new Date().toISOString()
      };

      const telemetryFile = writeTelemetry(basePath, issue.number, payload);
      telemetryPathUsed = telemetryFile;
      core.info(`📦 Telemetry written to ${telemetryFile}`);
    }

    const resultSummary = {
      track: classification.track,
      actions: classification.actions,
      milestone: finalMilestoneTitle,
      telemetryFile: telemetryPathUsed
    };

    core.setOutput("result", JSON.stringify(resultSummary));
    core.info("✅ Orchestrator Core completed successfully");
  } catch (err: any) {
    core.setFailed(`❌ Orchestrator error: ${err.message}`);
  }
}

run();
