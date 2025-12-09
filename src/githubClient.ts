import * as github from "@actions/github";
import { Octokit } from "@octokit/rest";

export function createOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  return github.getOctokit(token) as unknown as Octokit;
}
