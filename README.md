# MindForge Orchestrator Core  
### GitHub Action · Workflow Engine for Repo Automation

`mindforge-orchestrator-core` is the execution engine behind the MindForge Orchestrator GitHub App.  
It provides:

- Issue classification (track labels)
- Milestone enforcement
- Stale issue detection
- Telemetry event generation
- File updates inside your repository

This Action is designed to be consumed by Orchestrator workflows inside a repo.

---

## 🚀 Usage

```yaml
steps:
  - name: Run Orchestrator Core
    uses: garybayes/mindforge-orchestrator-core@v1
    with:
      config-path: .github/orchestrator.yml
📁 Repository Structure
arduino
Copy code
src/
  index.ts
  config.ts
  githubClient.ts
  issueClassifier.ts
  milestoneManager.ts
  milestoneRules.ts
  staleLogic.ts
  telemetry.ts
Compiled output is published under:

Copy code
dist/
📦 Development
Install dependencies:

bash
Copy code
npm install
Build:

bash
Copy code
npm run build
🧪 Testing (future)
Unit tests will be added using Vitest.

🏷 Versioning
Releases follow semantic versioning.
The v1 tag always points to the latest stable 1.x release.

To release:

bash
Copy code
git tag v1.0.1
git push origin v1.0.1
🔒 Security
No external services are contacted by this Action.
All operations run within GitHub-hosted or self-hosted runners.

📄 License
MIT License.

yaml
Copy code

---

# 📙 **README for `mindforge-orchestrator`**  
> (Place this at: `/README.md` in the Orchestrator App repo)

```md
# MindForge Orchestrator  
### GitHub App · Automated Workflows · Telemetry · Dashboards

MindForge Orchestrator is a GitHub App that brings **state-machine automation**,  
**sprint hygiene**, and **real-time dashboards** directly to your repository.

It is built for teams who want clarity, workflow consistency, and automated reporting.

---

## ✨ Features

- Automatic track label assignment
- Milestone enforcement & self-healing
- Nightly stale sweeps
- Repo diagnostics
- Telemetry event generation
- Dashboard JSON output
- Human-readable GitHub Actions workflows

---

## 🛠 Installation

1. Install the **MindForge Orchestrator GitHub App** (coming soon).
2. Add the configuration file:

.github/orchestrator.yml

markdown
Copy code

3. Ensure these workflows exist:

.github/workflows/
orchestrator-issue-events.yml
orchestrator-nightly-sweep.yml
orchestrator-dashboard-build.yml
orchestrator-self-test.yml

yaml
Copy code

4. Trigger a Self-Test:

GitHub Actions → “Orchestrator • Self Test”

---

## 📊 Dashboard Output

`dashboard/dashboard.json` is regenerated on each sweep or manual rebuild.

This JSON powers:

- GitHub Pages dashboards  
- External visualization layers  
- Future MindForge SaaS dashboards

---

## 📁 Repository Structure

.github/
orchestrator.yml
workflows/

dashboard/
telemetry/
docs/
scripts/

yaml
Copy code

---

## 🔧 Requirements

- GitHub Actions enabled in your repository  
- `GITHUB_TOKEN` with write permissions (default settings work)

---

## 📝 Documentation

See the `/docs` directory for:

- Technical design
- Feature roadmap
- Orchestrator self-test behavior
- SaaS expansion path

---

## 📄 License

MIT License.
