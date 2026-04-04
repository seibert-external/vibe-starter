# Setting Up a New Project

> 🤖 This guide is intended for AI agents (Claude Code, pi, Cursor) that assist a developer in setting up a new project.

## Before You Start

First ask the user if they have a basic understanding of **Git**, **GitHub**, and **Pull Requests**. If not, briefly explain the basics or point to learning resources — the project requires this knowledge. Without these fundamentals, the user won't be able to manage day-to-day work (branching, PRs, reviews, merge conflicts).

## Prerequisites (must be done by the human)

Before you as an agent can get started, make sure the user has completed the following:

### 1. Coolify Access

- [ ] Requested a Coolify account from IT (invite via email)
- [ ] Logged in at https://coolify-dev.seibert.tools
- [ ] Switched to the correct team (e.g. `mseibert-and-friends`) — **not** the personal team
- [ ] Created an API token at https://coolify-dev.seibert.tools/security/api-tokens with the following scopes:
  - `read` — Read project and app information
  - `write` — Create/modify projects, apps, DBs, and env vars
  - `deploy` — Trigger deployments

  The scopes `root` and `read:sensitive` are **not** needed.

> ⚠️ Ask the user for the API token and the Coolify base URL. **Never** store the token in files, repos, or GitHub Secrets. The token is only used temporarily as an environment variable in the terminal:
> ```bash
> export COOLIFY_API_URL="https://coolify-dev.seibert.tools/api/v1"
> export COOLIFY_API_TOKEN="<token from user>"
> ```

### 2. GitHub Repo Created

- [ ] New repo created from the template `seibert-external/vibe-starter`

**Option A — GitHub UI (recommended):**
1. Go to https://github.com/seibert-external/vibe-starter
2. Click the green **"Use this template"** → **"Create a new repository"**
3. Set owner to `seibert-external`, enter a repo name, and create

**Option B — GitHub CLI:**
```bash
gh repo create seibert-external/<projectname> \
  --template seibert-external/vibe-starter \
  --public
git clone https://github.com/seibert-external/<projectname>.git
cd <projectname>
```

### 3. VPN

- [ ] The user is connected to the Seibert VPN (Coolify is only accessible internally)

---

## Create Project on Coolify (done by the agent)

Once the prerequisites are met, create the project using the Coolify REST API. The base URL is `https://coolify-dev.seibert.tools/api/v1`.

### Fixed Values (Server `mseibert-and-friends`)

```
server_uuid:      pt76r6kv5gyciyjvr6bmhfy5
destination_uuid: rc50knh5c1h32nov6o0qojwi
github_app_uuid:  oj6x79m9ai4rj0r2zjdylw5n
domain_pattern:   *.mse.coolify-dev.seibert.tools
protocol:         http://  (HTTPS works anyway)
```

### Step 1: Create Project

```bash
curl -s "${COOLIFY_API_URL}/projects" \
  -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<projectname>-<username>",
    "description": "<short description>"
  }'
```

→ Returns `uuid`. Save as `PROJECT_UUID`.

> ⚠️ Ground rules: Always include your own name on projects/resources. The Coolify instance is shared.

### Step 2: Create PostgreSQL Database

```bash
curl -s "${COOLIFY_API_URL}/databases/postgresql" \
  -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "server_uuid": "pt76r6kv5gyciyjvr6bmhfy5",
    "project_uuid": "<PROJECT_UUID>",
    "environment_name": "production",
    "name": "<projectname>-db-<username>",
    "instant_deploy": true
  }'
```

→ Returns `uuid` and `internal_db_url`. The `internal_db_url` is the `POSTGRES_URL` for the app.

### Step 3: Create App

```bash
curl -s "${COOLIFY_API_URL}/applications/private-github-app" \
  -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "<PROJECT_UUID>",
    "server_uuid": "pt76r6kv5gyciyjvr6bmhfy5",
    "environment_name": "production",
    "destination_uuid": "rc50knh5c1h32nov6o0qojwi",
    "github_app_uuid": "oj6x79m9ai4rj0r2zjdylw5n",
    "git_repository": "seibert-external/<projectname>",
    "git_branch": "main",
    "build_pack": "dockerfile",
    "ports_exposes": "3000",
    "name": "<projectname>-<username>"
  }'
```

→ Returns `uuid` and `domains`. Save as `APP_UUID`.

### Step 4: Configure App

Set the preview URL template and enable preview deployments:

```bash
curl -s "${COOLIFY_API_URL}/applications/${APP_UUID}" \
  -X PATCH \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "preview_url_template": "{{pr_id}}-{{domain}}"
  }'
```

> ⚠️ **Important:** Preview Deployments must be enabled in the Coolify UI. Go to the application → Settings → Preview Deployments → enable the checkbox and click **Save**. This cannot currently be set via API. Without this, PR preview deployments won't work — Coolify's GitHub App webhook triggers preview builds only when this setting is active.

### Step 5: Set Environment Variables

The following env vars must be set. Set each variable **twice** — once for production (`is_preview: false`) and once for preview (`is_preview: true`):

| Variable | Value | Notes |
|---|---|---|
| `POSTGRES_URL` | `<internal_db_url from Step 2>` | Connection string to the database. Use the same URL for preview — the `entrypoint.sh` automatically detects preview deployments via `COOLIFY_BRANCH` and creates a separate DB per PR branch (`preview_<branch>`). |
| `NEXTAUTH_SECRET` | Randomly generated (`openssl rand -base64 32`) | |
| `NEXTAUTH_URL` | `http://<projectname>-<username>.mse.coolify-dev.seibert.tools` | Leave empty for preview — automatically set from `COOLIFY_URL` |
| `SSR_ENCRYPTION_KEY` | Randomly generated (`openssl rand -base64 32`) | |
| `NPM_TOKEN` | Ask the user or use org secret | For `@seibert/react-ui` |

API call per variable:

```bash
curl -s "${COOLIFY_API_URL}/applications/${APP_UUID}/envs" \
  -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "<KEY>",
    "value": "<VALUE>",
    "is_preview": false
  }'
```

> 💡 Don't set `NEXTAUTH_URL` for preview — the `entrypoint.sh` automatically sets it from `COOLIFY_URL`.

### Step 6: Configure GitHub Actions

Set the repository variable so the CI/CD pipeline works:

```bash
gh variable set COOLIFY_APP_UUID \
  --repo seibert-external/<projectname> \
  --body "${APP_UUID}"
```

The org secrets `COOLIFY_API_URL` and `COOLIFY_API_TOKEN` are already set on `seibert-external` with `visibility: all` and apply automatically.

### Step 7: Trigger First Deploy

Coolify auto-deploys on push via the GitHub App webhook. To trigger the first deploy manually (before any push):

```bash
curl -s "${COOLIFY_API_URL}/deploy?uuid=${APP_UUID}&force=true" \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}"
```

> 💡 After the first deploy, all subsequent deployments are triggered automatically by the Coolify GitHub App webhook — both for production (push to main) and preview (pull requests).

---

## Post-Setup Checklist

- [ ] App deployed and reachable at `http://<name>.mse.coolify-dev.seibert.tools`
- [ ] CI pipeline green on GitHub (`pnpm check` + `pnpm build`)
- [ ] Deploy pipeline shows expected 403 (until self-hosted runner is set up) or deploys successfully
- [ ] `COOLIFY_APP_UUID` set as GitHub repo variable

---

## Ground Rules (from IT docs)

These rules must be communicated to the user:

- 🚨 **Don't create servers/workers** — IT provides those
- 🚨 **No production applications** — tests and demos only
- 🚨 **No sensitive data** — others can see everything
- 🚨 **Always include your name** — the instance is shared
- 🚨 **Clean up after yourself** — delete what you no longer need
- 🚨 **No backups** — assume there are none
- ℹ️ Only accessible via VPN
- ℹ️ Use `http://` as protocol in Coolify (HTTPS works anyway)

Source: [Coolify User Documentation](https://seibertgroup.atlassian.net/wiki/spaces/IT/pages/5919309870)

---

## Troubleshooting

### `@seibert/react-ui` 404 during install
`NPM_TOKEN` is missing or incorrect. Check if it's set as an env var in Coolify and as an org secret on GitHub.

### Deploy pipeline shows 403
The Coolify instance is behind a firewall. The GitHub Actions pipeline cannot reach Coolify. This is a known issue — a self-hosted runner in the internal network is planned.

### Preview DB is not created
Preview DB branching is automatically activated when Coolify sets `COOLIFY_BRANCH` (for preview deployments). Make sure `POSTGRES_URL` is also set for preview and the Postgres user has `CREATE DATABASE` privileges (Coolify default: `postgres` superuser).

### Coolify shows "No deployment found"
The GitHub App needs access to the repo. Check at https://github.com/organizations/seibert-external/settings/installations whether the Coolify GitHub App can see the repo.

### Preview deployment not triggered / PR comment shows "Webhook deployment not found"
Preview deployments are triggered by the Coolify GitHub App webhook, **not** by the CI workflow. Check:
1. **Preview Deployments enabled** in Coolify UI (application → Settings → Preview Deployments)
2. **GitHub App** has access to the repo (check installations at GitHub org settings)
3. **Webhook delivery** is working (check GitHub App → Advanced → Recent Deliveries)
