# Neues Projekt aufsetzen

> 🤖 Diese Anleitung ist für AI-Agenten (Claude Code, pi, Cursor) gedacht, die einen Entwickler beim Aufsetzen eines neuen Projekts unterstützen.

## Voraussetzungen (muss der Mensch erledigen)

Bevor du als Agent loslegen kannst, stelle sicher, dass der Nutzer folgendes erledigt hat:

### 1. Coolify-Zugang

- [ ] Coolify-Account bei der IT angefragt (Invite per E-Mail)
- [ ] Eingeloggt unter https://coolify-dev.seibert.tools
- [ ] Zum richtigen Team gewechselt (z.B. `mseibert-and-friends`) — **nicht** das persönliche Team
- [ ] API Token erstellt unter https://coolify-dev.seibert.tools/security/api-tokens

> ⚠️ Frage den Nutzer nach dem API Token und der Coolify Base URL. Speichere den Token **niemals** in Dateien, Repos oder GitHub Secrets. Der Token wird nur temporär im Terminal als Umgebungsvariable genutzt:
> ```bash
> export COOLIFY_API_URL="https://coolify-dev.seibert.tools/api/v1"
> export COOLIFY_API_TOKEN="<token vom nutzer>"
> ```

### 2. GitHub-Repo erstellt

- [ ] Neues Repo in `seibert-external` erstellt (z.B. `seibert-external/mein-projekt`)
- [ ] Inhalt von `seibert-external/vibe-starter` als Basis kopiert

Der einfachste Weg:

```bash
# Repo erstellen
gh repo create seibert-external/<projektname> --public

# Vibe-Starter klonen und als Basis pushen
git clone https://github.com/seibert-external/vibe-starter.git <projektname>
cd <projektname>
git remote set-url origin https://github.com/seibert-external/<projektname>.git
git push origin main
```

### 3. VPN

- [ ] Der Nutzer ist mit dem Seibert-VPN verbunden (Coolify ist nur intern erreichbar)

---

## Projekt auf Coolify anlegen (macht der Agent)

Sobald die Voraussetzungen erfüllt sind, lege das Projekt mit der Coolify REST API an. Die Base URL ist `https://coolify-dev.seibert.tools/api/v1`.

### Feste Werte (Server `mseibert-and-friends`)

```
server_uuid:      pt76r6kv5gyciyjvr6bmhfy5
destination_uuid: rc50knh5c1h32nov6o0qojwi
github_app_uuid:  oj6x79m9ai4rj0r2zjdylw5n
domain_pattern:   *.mse.coolify-dev.seibert.tools
protocol:         http://  (HTTPS funktioniert trotzdem)
```

### Schritt 1: Projekt anlegen

```bash
curl -s "${COOLIFY_API_URL}/projects" \
  -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<projektname>-<nutzername>",
    "description": "<kurze Beschreibung>"
  }'
```

→ Gibt `uuid` zurück. Merken als `PROJECT_UUID`.

> ⚠️ Spielregeln: Immer den eigenen Namen an Projekte/Ressourcen schreiben. Die Coolify-Instanz wird geteilt.

### Schritt 2: PostgreSQL-Datenbank anlegen

```bash
curl -s "${COOLIFY_API_URL}/databases/postgresql" \
  -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "server_uuid": "pt76r6kv5gyciyjvr6bmhfy5",
    "project_uuid": "<PROJECT_UUID>",
    "environment_name": "production",
    "name": "<projektname>-db-<nutzername>",
    "instant_deploy": true
  }'
```

→ Gibt `uuid` und `internal_db_url` zurück. Die `internal_db_url` ist der `POSTGRES_URL` für die App.

### Schritt 3: App anlegen

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
    "git_repository": "seibert-external/<projektname>",
    "git_branch": "main",
    "build_pack": "dockerfile",
    "ports_exposes": "3000",
    "name": "<projektname>-<nutzername>"
  }'
```

→ Gibt `uuid` und `domains` zurück. Merken als `APP_UUID`.

### Schritt 4: App konfigurieren

Preview URL Template setzen:

```bash
curl -s "${COOLIFY_API_URL}/applications/${APP_UUID}" \
  -X PATCH \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "preview_url_template": "{{pr_id}}.{{domain}}"
  }'
```

### Schritt 5: Umgebungsvariablen setzen

Folgende Env Vars müssen gesetzt werden. Setze jede Variable **zweimal** — einmal für Production (`is_preview: false`) und einmal für Preview (`is_preview: true`):

| Variable | Wert | Hinweis |
|---|---|---|
| `POSTGRES_URL` | `<internal_db_url aus Schritt 2>` | Connection-String zur Datenbank |
| `POSTGRES_ADMIN_URL` | `<internal_db_url aus Schritt 2>` | **Nur für Preview** (`is_preview: true`). Gleiche URL wie `POSTGRES_URL`. Dient als Feature-Flag: wenn gesetzt, erstellt der `entrypoint.sh` automatisch eine eigene DB pro PR-Branch (`preview_<branch>`) und überschreibt `POSTGRES_URL` darauf. Wenn nicht gesetzt, wird `POSTGRES_URL` direkt genutzt (Production-Modus). |
| `NEXTAUTH_SECRET` | Zufällig generieren (`openssl rand -base64 32`) | |
| `NEXTAUTH_URL` | `http://<projektname>-<nutzername>.mse.coolify-dev.seibert.tools` | Für Preview leer lassen — wird automatisch aus `COOLIFY_URL` gesetzt |
| `SSR_ENCRYPTION_KEY` | Zufällig generieren (`openssl rand -base64 32`) | |
| `NPM_TOKEN` | Vom Nutzer erfragen oder aus Org-Secret | Für `@seibert/react-ui` |

API-Call pro Variable:

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

> 💡 `POSTGRES_ADMIN_URL` nur mit `is_preview: true` setzen. Production braucht das nicht.

> 💡 `NEXTAUTH_URL` für Preview nicht setzen — der `entrypoint.sh` setzt es automatisch aus `COOLIFY_URL`.

### Schritt 6: GitHub Actions konfigurieren

Repository-Variable setzen damit die CI/CD-Pipeline funktioniert:

```bash
gh variable set COOLIFY_APP_UUID \
  --repo seibert-external/<projektname> \
  --body "${APP_UUID}"
```

Die Org-Secrets `COOLIFY_API_URL` und `COOLIFY_API_TOKEN` sind bereits auf `seibert-external` mit `visibility: all` gesetzt und greifen automatisch.

### Schritt 7: Ersten Deploy triggern

```bash
curl -s "${COOLIFY_API_URL}/deploy?uuid=${APP_UUID}&force=true" \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}"
```

---

## Checkliste nach dem Setup

- [ ] App deployed und erreichbar unter `http://<name>.mse.coolify-dev.seibert.tools`
- [ ] CI-Pipeline grün auf GitHub (`pnpm check` + `pnpm build`)
- [ ] Deploy-Pipeline zeigt erwarteten 403 (bis Self-hosted Runner steht) oder deployed erfolgreich
- [ ] `COOLIFY_APP_UUID` als GitHub Repo Variable gesetzt

---

## Spielregeln (aus der IT-Doku)

Diese Regeln müssen dem Nutzer kommuniziert werden:

- 🚨 **Keine Server/Worker anlegen** — die stellt die IT
- 🚨 **Keine produktiven Anwendungen** — nur Tests und Demos
- 🚨 **Keine sensiblen Daten** — andere können alles sehen
- 🚨 **Eigenen Namen überall dranschreiben** — die Instanz wird geteilt
- 🚨 **Hinter sich aufräumen** — nicht mehr Gebrauchtes löschen
- 🚨 **Keine Backups** — davon ausgehen, dass es keine gibt
- ℹ️ Nur über VPN erreichbar
- ℹ️ `http://` als Protokoll in Coolify (HTTPS geht trotzdem)

Quelle: [Anwenderdoku Coolify](https://seibertgroup.atlassian.net/wiki/spaces/IT/pages/5919309870)

---

## Troubleshooting

### `@seibert/react-ui` 404 beim Install
`NPM_TOKEN` fehlt oder ist falsch. Prüfe ob es als Env Var in Coolify und als Org-Secret auf GitHub gesetzt ist.

### Deploy-Pipeline zeigt 403
Die Coolify-Instanz ist hinter einer Firewall. Die GitHub Actions Pipeline kann Coolify nicht erreichen. Das ist ein bekanntes Problem — ein Self-hosted Runner im internen Netzwerk ist in Planung.

### Preview-DB wird nicht erstellt
`POSTGRES_ADMIN_URL` muss als Preview-Env-Var gesetzt sein. Ohne diese Variable überspringt der `entrypoint.sh` das DB-Branching.

### Coolify zeigt "No deployment found"
Die GitHub App braucht Zugriff auf das Repo. Prüfe unter https://github.com/organizations/seibert-external/settings/installations ob die Coolify GitHub App das Repo sehen kann.
