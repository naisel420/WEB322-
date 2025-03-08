/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Naisel Varghese Student ID: 167251222 Date: 2025-03-07
*
* Published URL: [Your Vercel URL Here]
*
********************************************************************************/
const express = require("express");
const path = require("path");
const projectData = require(path.join(__dirname, "modules", "projects.js"));

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Initialize data
projectData.initialize().then(() => {
  console.log("Data initialized successfully");
}).catch(err => {
  console.error("Failed to initialize data:", err);
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  const responseData = {
    studentName: "Naisel Varghese",
    studentId: "167251222",
    timestamp: new Date()
  };

  const handleResponse = data => {
    responseData.data = data;
    res.json(responseData);
  };

  const handleError = err => {
    responseData.error = err;
    res.status(404).json(responseData);
  };

  sector ? projectData.getProjectsBySector(sector).then(handleResponse).catch(handleError)
         : projectData.getAllProjects().then(handleResponse).catch(handleError);
});

app.get("/solutions/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);
  const responseData = {
    studentName: "Naisel Varghese",
    studentId: "167251222",
    timestamp: new Date()
  };

  projectData.getProjectById(projectId)
    .then(data => {
      responseData.data = data;
      res.json(responseData);
    })
    .catch(err => {
      responseData.error = err;
      res.status(404).json(responseData);
    });
});

app.post("/post-request", (req, res) => {
  res.json({
    studentName: "Naisel Varghese",
    studentId: "167251222",
    timestamp: new Date(),
    body: req.body
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404.html"), {
    headers: {
      "X-Student-Name": "Naisel Varghese",
      "X-Student-ID": "167251222",
      "X-Timestamp": new Date().toISOString()
    }
  });
});

// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
