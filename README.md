# InkSync 🖋️

[![CI/CD via Azure DevOps](https://img.shields.io/badge/CI%2FCD-Azure%20DevOps-blue?logo=azuredevops&logoColor=white)](https://dev.azure.com/Junaid-Arif/InkSync)
[![Frontend UI](https://img.shields.io/badge/Frontend-Blog%20UI-blueviolet?logo=azurewebapps)](https://inksync-ui-fmewgcceaehfbgc9.canadacentral-01.azurewebsites.net/)
[![Backend API](https://img.shields.io/badge/Backend-API%20Server-orange?logo=azurewebapps)](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/)
[![Swagger Docs](https://img.shields.io/badge/Docs-Swagger%20UI-brightgreen?logo=swagger)](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/api-docs)
[![GitHub Repo](https://img.shields.io/badge/Code-GitHub-black?logo=github)](https://github.com/junaid-mohammad/InkSync)

**InkSync** is a modular full-stack blogging platform built to simulate the separation of concerns between API services and user-facing interfaces. Designed with scalability, maintainability, and deployment in mind, the project consists of:

- A fully documented **RESTful API** with Swagger
- A user-friendly **frontend UI** to create, edit, and delete posts
- **In-memory data handling** for simplified server behavior
- Two independently deployed services via **Azure App Services**

---

## 💻 Live Services

- 🖋️ **[InkSync API](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/)** — REST API endpoint
- 📖 **[Swagger Docs](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/api-docs)** — API documentation
- 📰 **[InkSync UI](https://inksync-ui-fmewgcceaehfbgc9.canadacentral-01.azurewebsites.net/)** — User interface
- 🛠 **[Azure DevOps Project](https://dev.azure.com/Junaid-Arif/InkSync)** — CI/CD pipelines and build logs

---

## 🌟 Purpose

InkSync was built to:

- Demonstrate real-world **REST API design** and **frontend-backend separation**
- Practice **modularization** by keeping API and UI codebases independent
- Work with **Swagger/OpenAPI** for automated documentation
- Simulate **client-server** communication via Axios and Express
- Set up and manage **CI/CD workflows using Azure DevOps**
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

| Layer      | Tech Stack                          |
| ---------- | ----------------------------------- |
| Backend    | Node.js, Express                    |
| Frontend   | Express (server-rendered), EJS, CSS |
| API Docs   | Swagger UI, OpenAPI                 |
| Middleware | Axios, Body-parser                  |
| Deployment | Azure App Service, Azure DevOps     |

---

## 🚪 Setup & Folder Structure

```
InkSync
├── api
│   ├── index.js            # API server
│   ├── data/posts.js       # In-memory blog post data
│   ├── swagger.json        # API documentation
│   └── views/index.ejs     # Landing page
│
├── ui
│   ├── index.js            # Frontend server
│   ├── views/index.ejs     # Homepage (list posts)
│   ├── views/modify.ejs    # Create/Edit post UI
│   └── public/styles/      # CSS files
└── README.md
```

---

## 🛫 Deployment Guide

InkSync is deployed as **two independent Node.js applications** using **Microsoft Azure App Services**, with automated CI/CD managed via **Azure DevOps Pipelines**. The project is organized for **modularity**, **clarity**, and **scalability**, with:

- `InkSync-API` → RESTful API server (runs from `api/index.js`)
- `InkSync-UI` → Frontend server rendering EJS views (runs from `ui/index.js`)

---

### 🛠 Step-by-Step Setup

1. **Created Azure App Services**

   - Two App Service instances were created:
     - `InkSync-API` — Hosts the REST API
     - `InkSync-UI` — Hosts the frontend interface
   - Each was configured to run Node.js 18 and point to their respective `index.js` files

2. **Version Control Setup**

   - Project hosted in **two remote repositories**:
     - **GitHub**: [`github.com/junaid-mohammad/InkSync`](https://github.com/junaid-mohammad/InkSync)
     - **Azure Repos**: [`dev.azure.com/Junaid-Arif/InkSync`](https://dev.azure.com/Junaid-Arif/InkSync)
   - Both `api/` and `ui/` folders live in the same monorepo
   - Development is done locally and pushed to both remotes for visibility and deployment:
     ```bash
     git remote add origin https://github.com/junaid-mohammad/InkSync.git
     git remote add azure https://Junaid-Arif@dev.azure.com/Junaid-Arif/InkSync/_git/InkSync
     ```

3. **Configured Azure DevOps Pipelines for CI/CD**

   - Deployment center in Azure App Service connected to Azure Repos `main` branch
   - Each App Service points to its relevant subfolder (`api/` or `ui/`)
   - Each app includes a `package.json` with:
     ```json
     "start": "node index.js"
     ```
   - Azure auto-detects the entry point and builds the app

4. **Environment Configuration**

   - `PORT` environment variable set by Azure automatically (used via `process.env.PORT`)
   - On `InkSync-UI`, an additional variable was configured:
     - `API_URL` → Public URL of the `InkSync-API` App Service

5. **Deployment Workflow**
   - Code pushed to both GitHub and Azure Repos triggers automatic deployment:
     ```bash
     git add .
     git commit -m "Update API and UI routes"
     git push origin main     # For GitHub
     git push azure main      # For Azure DevOps CI/CD
     ```
   - Logs and deployment history visible via **Azure DevOps Pipeline runs**

---

## 🚫 In-Memory Disclaimer

> **Note:** Data is stored in memory only. On every restart, posts reset to the original 3 sample entries. This is intentional to demonstrate functionality without database dependencies.

---

## 🔬 API Documentation (Swagger)

- Live: **[https://inksync-api.azurewebsites.net/api-docs](https://inksync-api-fka2anc8fsdubqa4.canadacentral-01.azurewebsites.net/api-docs)**
- Includes:

  - All endpoints with `GET`, `POST`, `PATCH`, and `DELETE`
  - Parameters, schemas, status codes, and example payloads
  - Models for `Post` and `PostInput`

---

## 🧠 What I Learned

- Managing **modular Node.js apps** and routing independently
- Using **EJS** to dynamically display post content
- How to properly separate **frontend and API** responsibilities
- Building **Swagger/OpenAPI 3.0** schemas from scratch
- Performing **deployment with multiple App Services** on Azure
- Managing codebases in **Azure DevOps**, including pipelines and logs

---

## 🤝 Contribution

This project was built as a portfolio/demo API.
Feel free to fork it, explore, remix, or suggest improvements!

---

## 📄 License

This project is open-source and free to use for personal or educational purposes.

---

## ✨ Credits

Built by Junaid Arif. Inspired by real-world web application architecture and designed as a scalable full-stack showcase.
