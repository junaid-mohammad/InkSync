# InkSync 🖋️

[![CI/CD via GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=github&logoColor=white)](https://github.com/junaid-mohammad/InkSync/)
[![Frontend UI](https://img.shields.io/badge/Frontend-Blog%20UI-blueviolet?logo=azurewebapps)](https://inksync-ui-fmewgcceaehfbgc9.canadacentral-01.azurewebsites.net/)
[![Backend API](https://img.shields.io/badge/Backend-API%20Server-orange?logo=azurewebapps)](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/)
[![Swagger Docs](https://img.shields.io/badge/Docs-Swagger%20UI-brightgreen?logo=swagger)](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/api-docs)
[![Azure DevOps](https://img.shields.io/badge/VC-Azure%20DevOps-blue?logo=azuredevops&logoColor=white)](https://dev.azure.com/Junaid-Arif/InkSync)

**InkSync** is a modular full-stack blogging platform built to simulate the separation of concerns between API services and user-facing interfaces. Designed with scalability, maintainability, and CI/CD automation in mind, the project consists of:

- A fully documented **RESTful API** with Swagger
- A user-friendly **frontend UI** to create, edit, and delete posts
- **In-memory data handling** for simplified backend logic
- Two independently deployed services via **Azure App Services**
- CI/CD pipelines via **GitHub Actions**

---

## 💻 Live Services

- 📰 **[InkSync UI](https://inksync-ui-fmewgcceaehfbgc9.canadacentral-01.azurewebsites.net/)**
- 🖋️ **[InkSync API](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/)**
- 📖 **[Swagger Docs](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/api-docs)**
- 🛠 **[GitHub Repo](https://github.com/junaid-mohammad/InkSync)**
- 🛠 **[Azure DevOps](https://dev.azure.com/Junaid-Arif/InkSync)**

---

## 🌟 Purpose

InkSync was designed to:

- Demonstrate real-world **REST API design** and **frontend-backend separation**
- Practice **modularization** by keeping API and UI codebases independent
- Work with **Swagger/OpenAPI** for automated documentation
- Simulate **client-server** communication via Axios and Express
- Set up reliable CI/CD pipelines using **GitHub Actions**
- Experiment with **multi-app deployment** on Azure App Services

---

## ⚖️ Architecture & Features

### 📊 1. Modular Design

- **API Service (`/api`)** handles all CRUD operations for blog posts
- **UI Service (`/ui`)** fetches and manipulates post data via HTTP requests to the API
- Separate **package.json**, deployment settings, and hosting plans

### 🔄 2. RESTful API

- Routes: `GET /posts`, `GET /posts/:id`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`
- All data is stored in an **in-memory array** to mimic backend behavior
- JSON responses returned using `res.json()`
- Auto-incremented `id` and generated `date` fields

### 🔍 3. Swagger Integration

- API is fully documented with **OpenAPI 3.0** specs
- Accessible at `/api-docs`
- Schemas: `Post` and `PostInput`
- All methods, parameters, and response types defined with **live examples**

### 🔸 4. Frontend UI

- UI built using **Express**, **EJS**, and **Axios**
- Routes:

  - `/` - Homepage (list all posts)
  - `/new` - Create post form
  - `/edit/:id` - Edit post form

- Includes **cancel buttons**, **form validations**, and **dynamic rendering**

---

## 🚀 Technologies Used

| Layer      | Tech Stack                         |
| ---------- | ---------------------------------- |
| Backend    | Node.js, Express                   |
| Frontend   | Express, EJS, CSS, Axios           |
| API Docs   | Swagger UI, OpenAPI                |
| Deployment | Azure App Services, GitHub Actions |
| Versioning | GitHub + Azure Repos (read-only)   |

---

## 👮 Setup & Folder Structure

```
InkSync
├── .github/workflows
│   ├── api.yml                  # GitHub Actions for API deployment
│   └── ui.yml                   # GitHub Actions for UI deployment
├── api
│   ├── data/posts.js            # In-memory blog post data
│   ├── public/styles/index.css # API styles
│   ├── views/index.ejs         # API landing page view
│   ├── index.js                # API server entry point
│   ├── package.json            # API dependencies
│   ├── package-lock.json       # API lockfile
│   └── swagger.json            # OpenAPI documentation
├── ui
│   ├── public/styles/index.css # UI styles
│   ├── views/index.ejs         # UI homepage
│   ├── views/modify.ejs        # Create/Edit post view
│   ├── index.js                # UI server entry point
│   ├── package.json            # UI dependencies
│   └── package-lock.json       # UI lockfile
├── README.md                   # Project documentation
└── DeploymentChallenges.md     # Detailed deployment log and postmortem
```

---

## 🛫 Deployment Guide

InkSync is deployed as **two independent Node.js applications** using **Azure App Services**, with automated CI/CD handled by **GitHub Actions**, and **Azure DevOps** retained for source control tracking and potential future CI/CD use.

---

### 🛠 Step-by-Step Setup

1. **Created Azure App Services**

   - Two App Service instances were provisioned:
     - `InkSync-API` — Hosts the RESTful API
     - `InkSync-UI` — Hosts the frontend blog interface
   - Each service was configured with:

     - **Runtime**: Node.js 18
     - **Startup Command** (set in Azure Portal → Configuration → General Settings):

       ```bash
       cd api && npm install && npm start   # for API
       cd ui && npm install && npm start    # for UI
       ```

2. **Version Control Configuration**

   - Both **GitHub** and **Azure Repos** were added as remotes:
     - GitHub is now the **primary development + CI/CD platform**
     - Azure Repos is kept for **version control backup and logs**
   - Remote setup:

     ```bash
     git remote add origin https://github.com/junaid-mohammad/InkSync.git
     git remote add azure https://Junaid-Arif@dev.azure.com/Junaid-Arif/InkSync/_git/InkSync
     ```

   - Development is pushed to both remotes to maintain visibility:
     ```bash
     git add .
     git commit -m "Deploy update"
     git push origin main     # Triggers GitHub Actions
     git push azure main      # Pushes to Azure Repos for tracking
     ```

3. **GitHub Actions CI/CD Configuration**

   - Two workflows created in `.github/workflows/`:
     - `api.yml`: Deploys API service on `api/**` changes
     - `ui.yml`: Deploys UI service on `ui/**` changes
   - Each uses the `azure/webapps-deploy@v3` GitHub Action with deployment secrets:
     - `INKSYNC_API_PUBLISH_PROFILE`
     - `INKSYNC_UI_PUBLISH_PROFILE`
   - Secrets contain raw publish profile XML downloaded from Azure → App Service → Deployment Center → Manage publish profile.

4. **Environment Variables Setup**

   - Automatically handled:
     - `PORT` is injected by Azure and used in both services via `process.env.PORT`
   - Manually added to `InkSync-UI` App Service:
     - Key: `API_URL`
     - Value: `https://inksync-api.azurewebsites.net`

5. **Lockfile Warning Resolution**

   - Initial deployments raised a `Dependencies lock file is not found` warning.
   - Resolved by running:
     ```bash
     npm install && npm i --package-lock-only
     ```

6. **Workflow Trigger Note**

   - GitHub Actions workflows are configured with `paths: [api/**]` or `paths: [ui/**]`
   - Changes to files outside these directories (e.g., README.md) will **not trigger deployment**
   - Manual trigger can be used from the Actions tab → Select workflow → “Run workflow”

7. **Troubleshooting Learnings**

   - **Deployment Stalling**: Occurs if App Service is restarted or modified during workflow deployment.
   - **Fix**:

     1. Manually restart both App Services from Azure Portal.
     2. Wait ~1–2 minutes for SCM to stabilize.
     3. Re-run the GitHub workflow job from the Actions tab.

   - **In-Memory Persistence**: Posts remain live until App Service is manually restarted or redeployed (cold start or crash will also reset them).
   - **Note**: A detailed document DepoloymentChallenges.md is added to the repository documenting all the Challenges and Learnings in trying to deploy this app.

---

### ✅ Final Setup Summary

- GitHub = primary CI/CD (actions, secrets, workflows)
- Azure Repos = secondary source control (no pipelines active)
- Azure App Services = deployment targets (manual config for runtime, env, and start script)
- Publish profile authentication = used for secure deployment

## 🚫 In-Memory Data Disclaimer

> **Note:** Blog data is **not persisted**. Posts are stored in a server memory array and:
>
> - Will survive **page refreshes**
> - Will persist **until App Service is restarted or redeployed**
> - Are **wiped** on manual restart or redeployment
>
> 🔒 **Security Note:** There is no authentication. Anyone with frontend access can read/write/delete posts. For production:
>
> - Implement authentication (JWT/OAuth)
> - Use a real database (e.g. MongoDB, PostgreSQL)
> - Add RBAC for post management

---

## 🔬 API Documentation (Swagger)

- Live: **[https://inksync-api.azurewebsites.net/api-docs](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/api-docs)**
- Includes:

  - All endpoints with `GET`, `POST`, `PATCH`, and `DELETE`
  - Parameters, schemas, status codes, and example payloads
  - Models for `Post` and `PostInput`

---

## 🧠 What I Learned

- CI/CD with GitHub Actions and App Services.
- Managing secrets and workflows per subfolder.
- Debugging Azure SCM stalls and cold starts.
- Hybrid version control setup using GitHub + Azure Repos.
- Real-world monorepo challenges with multi-app deployment.
- Managing **modular Node.js apps** and routing independently
- Using **EJS** to dynamically display post content
- How to properly separate **frontend and API** responsibilities
- Building **Swagger/OpenAPI 3.0** schemas from scratch

---

## 🤝 Contribution

This project was built as a portfolio/demo API.
Feel free to fork it, explore, remix, or suggest improvements!

---

## 📄 License

This project is open-source and free to use for personal or educational purposes.

---

## ✨ Credits

Built by **Junaid Arif**. Inspired by real-world web application architecture and designed as a scalable demo of full-stack app architecture and CI/CD in the cloud.
