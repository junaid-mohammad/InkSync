// ============================
// index.js — The RESTful API Server (Runs on localhost:4000)
// ============================

// ========== Module Imports ==========
import express from "express";                      // Core Express framework
import bodyParser from "body-parser";               // Middleware to parse incoming request bodies
import swaggerUi from "swagger-ui-express";         // Swagger middleware for serving API documentation
import fs from "fs";                                // Node.js file system module for reading Swagger JSON

// ========== Local Data ==========
import { posts, lastId as lastUsedId } from "./data/posts.js";  // Import in-memory blog data and last ID tracker

// ========== Express App Setup ==========
const app = express();
const port = process.env.PORT || 4000;              // Use environment port or fallback to 4000
let lastId = lastUsedId;                            // Local mutable copy of the last used ID

// ========== Middleware Configuration ==========
app.use(bodyParser.json());                         // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data (URL-encoded)
app.use(express.json());                            // Allow parsing application/json
app.set("view engine", "ejs");                      // Set EJS as the templating engine
app.use(express.static("public"));                  // Serve static assets from /public

// ==========================
//         ROUTES
// ==========================

// ---------- Home Page ----------
app.get("/", (req, res) => res.render("index.ejs"));  // Render API homepage UI

// ---------- Swagger Docs ----------
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));  // Swagger UI at /api-docs

// ==========================
//         API ROUTES
// ==========================

/**
 * GET /posts
 * Retrieve all blog posts in the in-memory store.
 */
app.get("/posts", (req, res) => {
  res.json(posts);
});

/**
 * GET /posts/:id
 * Retrieve a specific post by its ID.
 */
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundPost = posts.find((post) => post.id === id);

  if (!foundPost) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(foundPost);
});

/**
 * POST /posts
 * Create a new blog post.
 * Fields required: title, content, author.
 */
app.post("/posts", (req, res) => {
  const newId = ++lastId;

  const newPost = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString().slice(0, 10),  // Format: YYYY-MM-DD
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

/**
 * PATCH /posts/:id
 * Partially update a blog post by ID.
 */
app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Only update fields that are provided
  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.json(post);
});

/**
 * DELETE /posts/:id
 * Remove a post by ID from the in-memory array.
 */
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = posts.findIndex((post) => post.id === id);

  if (index > -1) {
    posts.splice(index, 1);
    return res.status(200).json({ message: "Post deleted." });
  } else {
    return res.status(404).json({
      error: `Post with id: ${id} not found. No posts were deleted.`,
    });
  }
});

// ========== Start Server ==========
app.listen(port, () => {
  console.log(`API is running on port ${port}.`);
});
