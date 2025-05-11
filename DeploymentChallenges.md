# InkSync Deployment Challenges & Solutions

This document outlines the complete journey, challenges, missteps, and final solutions encountered while deploying the **InkSync** project — a monorepo consisting of two subfolders (`api/` and `ui/`) — to **two separate Azure App Services**, using **CI/CD pipelines**. This record serves as a technical logbook for future reference and learning.

---

## 🧭 Deployment Goals

- **Architecture**: Deploy one monorepo to two distinct Azure App Services:

  - `InkSync-API`: Hosts the RESTful blog API.
  - `InkSync-UI`: Hosts the frontend EJS-based blog interface.

- **Tools**:

  - Azure App Service (Free Tier)
  - Azure DevOps Pipelines (initially)
  - Azure Repos for version control (initially)
  - GitHub Actions (final solution)

---

## 🧨 Attempt #1: Azure DevOps with Azure Repos

### ✅ Initial Plan

- Use **Azure DevOps Pipelines** connected to **Azure Repos** (as done for previous projects).
- Create separate YAML files for `api/` and `ui/` folders.

### ❌ Problems Faced

1. **No Way to Select Subfolders in Deployment Center**

   - Azure DevOps' Deployment Center UI does not allow selecting a subfolder (like `api/` or `ui/`) in a monorepo.

2. **Service Connection Not Found**

   - Error: `The pipeline is not valid. Service connection "Azure for Students" could not be found.`
   - Tried setting up service connections under **Project Settings → Service Connections**, but got errors due to:

     - Insufficient permissions
     - Missing Entra ID (formerly AAD) registration rights

3. **App Registration Failed**

   - Error: `Failed to create an app in Microsoft Entra. Ensure that the user has permissions.`
   - This happened even after enabling **System Assigned Managed Identity** on both App Services.

4. **Managed Identity Dropdown Empty**

   - Despite assigning roles like `Contributor`, the managed identity never showed up when trying to create a service connection via federation.

5. **Permissions Confusion**

   - Tried giving `Contributor` role at various scopes: subscription, resource group, app service.
   - Tried dozens of role combinations (Website Contributor, Web Plan Contributor, etc.) — none worked.

### ✅ Workaround Attempt

- Switched to **Publish Profile Authentication** for deployment.
- Exported `.PublishSettings` from Azure Portal → App Service → Deployment Center → Manage Publish Profile.

### ❌ New Problem

- Azure DevOps still failed to recognize or connect publish profile-based deployments via pipelines.
- Hit dead end: Azure DevOps requires hosted parallelism grant.

---

## 🔒 Hosted Parallelism Issue

### ❌ Error Received

```
No hosted parallelism has been purchased or granted. To request a free parallelism grant...
```

- Azure for Students does **not automatically include** hosted build agents.
- Grant must be manually requested **once per lifetime**.
- Didn't want to use up the only free parallel job yet — paused DevOps route.

---

## 🔁 Pivot: GitHub Actions for CI/CD

### ✅ Switched Plan

- Use **GitHub Actions** for CI/CD
- Still deploy to Azure App Services using **Publish Profile** (same ones downloaded before)
- Use **GitHub Secrets** to store publish profiles securely

### 🔧 Setup

- Created `.github/workflows/api.yml` and `ui.yml`
- Each YAML workflow:

  - Triggers only on changes within respective subfolders
  - Installs Node.js 18
  - Installs dependencies
  - Deploys using `azure/webapps-deploy@v3` action

### ❌ New Issues

1. **Workflow Push Rejected**

   - Error: `refusing to allow a Personal Access Token to create or update workflow ".github/workflows/*.yml" without workflow scope.`
   - Solution: Generated new **PAT** with `workflow` scope. Used it via HTTPS auth or SSH.

2. **GitHub Secrets**

   - Manually created secrets:

     - `INKSYNC_API_PUBLISH_PROFILE`
     - `INKSYNC_UI_PUBLISH_PROFILE`

   - Populated using raw content of downloaded publish profiles

3. **Workflows Didn’t Trigger Automatically**

   - Root `README.md` edit didn’t affect subfolders, so workflows didn’t run.
   - Trigger only fires if files in `api/**` or `ui/**` are changed
   - Manual workflow dispatch used for testing

4. **Lock File Missing Warning**

   - Warning: `Dependencies lock file is not found... package-lock.json`
   - Solution: Added `package-lock.json` using `npm install && npm i --package-lock-only`

5. **Deployment Stalled for 40+ Minutes**

   - Error Message: Deployment has been stopped due to SCM container restart...
   - Cause: Deployment system was interrupted because of a quick succession of "Save", "Restart", or "Change Configuration" operations in Azure Portal.
   - Note: Unclear if the delay was caused by running both deployments simultaneously or a cold-start issue, but the fix ensured the apps booted properly.
   - Solution:

     1. Manually restart both App Services from Azure Portal:

        - Go to InkSync-API > Overview > Restart
        - Go to InkSync-UI > Overview > Restart

     2. Wait for 1-2 minutes to ensure SCM stabilizes
     3. Re-run the GitHub Actions workflows from GitHub Actions tab:

        - Click into the failed workflow → "Re-run all jobs"

6. **Frontend API Error (`Error fetching posts`)**

   - Symptom: UI rendered nothing; browser console/logs showed:
     ```json
     { "message": "Error fetching posts" }
     ```
   - Cause: `API_URL` was not set in the environment, so frontend defaulted to `localhost:4000`.
   - Solution: In **Azure Portal → InkSync-UI → Environment Variables**, added the following:
     - Key: `API_URL`
     - Value: `https://inksync-api.azurewebsites.net`

7. **Nothing Rendered on App Sites Post-Deployment**

   - Symptom: Visiting either app’s Azure URL returned a blank page or server crash.
   - Cause: Azure was not running the app correctly after deployment (no `npm start` command was automatically detected).
   - Fix:
     - In Azure Portal → App Service → Configuration → General settings → Startup Command, added:
       ```bash
       cd ui && npm install && npm start   # same for api
       ```
     - This command ensures dependencies are installed before booting the app via the `start` script defined in each subfolder’s `package.json`.

8. **Final Stability Fixes**

   - Confirmed node version compatibility
   - Adjusted cache paths in workflows:

     - `cache-dependency-path: api/package-lock.json`
     - `cache-dependency-path: ui/package-lock.json`

   - Cleaned up environment variables and startup commands

---

## ✅ Final Outcome

- **✅ InkSync-API**

  - URL: [https://inksync-api.azurewebsites.net/](https://inksync-api.azurewebsites.net/)
  - Swagger Docs: [https://inksync-api.azurewebsites.net/api-docs](https://inksync-api.azurewebsites.net/api-docs)

- **✅ InkSync-UI**

  - URL: [https://inksync-ui.azurewebsites.net/](https://inksync-ui.azurewebsites.net/)

### GitHub Actions Workflows:

- `.github/workflows/api.yml`
- `.github/workflows/ui.yml`

### Azure App Service Settings:

- Startup command: `npm install && npm start`
- Node version: 18.x (set manually if needed)
- Environment variable (`UI App`): `API_URL=https://inksync-api.azurewebsites.net`

---

## 📚 Lessons Learned

- Azure DevOps isn’t ideal for **multi-folder deployments** from monorepos (especially with free/student tiers)
- **Service Connections** and **Managed Identity** require elevated Entra permissions
- **GitHub Actions** + **Publish Profile + Secrets** is the most reliable free path
- Startup command in App Service is **essential** if you're deploying zipped code directly (not containerized)
- Split your workflows by folder and only run when needed using `paths:`

---

## 📁 File References

- [x] `api/index.js`: API Server
- [x] `ui/index.js`: UI Server
- [x] `.github/workflows/api.yml`: GitHub Actions for API
- [x] `.github/workflows/ui.yml`: GitHub Actions for UI
- [x] Azure Secrets: `INKSYNC_API_PUBLISH_PROFILE`, `INKSYNC_UI_PUBLISH_PROFILE`

---

This document reflects the 30+ hour deployment journey of InkSync and serves as a comprehensive postmortem for infrastructure setup and CI/CD integration.

_Junaid Arif — May, 2025_
