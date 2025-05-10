// ============================
// index.js — The Web Frontend Server (Runs on localhost:3000)
// ============================

// ========== Module Imports ==========
import express from "express";                      // Core Express framework
import bodyParser from "body-parser";               // Middleware for parsing form data
import axios from "axios";                          // HTTP client to interact with the API

// ========== App Configuration ==========
const app = express();
const port = process.env.PORT || 3000;              // Port for the UI server
const API_URL = process.env.API_URL || 
                "http://localhost:4000";            // Base URL for the API

app.set("view engine", "ejs");                      // Set EJS as the templating engine
app.use(express.static("public"));                  // Serve static assets from /public

// ========== Middleware ==========
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json());                         // Parse JSON data

// ============================
//        FRONTEND ROUTES
// ============================

/**
 * GET /
 * Render the homepage and display all blog posts from the API.
 */
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);   // Fetch posts from API
    res.render("index.ejs", { posts: response.data });      // Pass posts to the view
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

/**
 * GET /new
 * Render the form to create a new blog post.
 */
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

/**
 * GET /edit/:id
 * Render the edit form for a specific post.
 */
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

/**
 * POST /api/posts
 * Submit a new blog post to the API.
 */
app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);   // Send new post to API
    res.redirect("/");                                // Redirect back to homepage
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

/**
 * POST /api/posts/:id
 * Submit updated blog post data (PATCH request).
 */
app.post("/api/posts/:id", async (req, res) => {
  try {
    await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);   // Patch existing post
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

/**
 * GET /api/posts/delete/:id
 * Delete a post by ID.
 */
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);    // Delete post from API
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// ========== Start Server ==========
app.listen(port, () => {
  console.log(`Frontend server is running on port ${port}`);
});
