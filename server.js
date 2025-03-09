/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Naisel Varghese Student ID: 167251222 Date: 2025-03-09
*
* Published URL: [Your Vercel URL Here]
*
********************************************************************************/
const express = require("express");
const path = require("path");
const projectData = require(path.join(__dirname, "modules", "projects.js"));

const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.static(__dirname +"/public"));
app.use(express.json());


projectData.initialize().then(() => {
  console.log("Data initialized successfully");
}).catch(err => {
  console.error("Failed to initialize data:", err);
});


app.get("/", (req, res) => {
  res.render("home", {
    studentName: "Naisel Varghese",
    studentId: "167251222",
    timestamp: new Date()
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    studentName: "Naisel Varghese",
    studentId: "167251222",
    timestamp: new Date()
  });
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
    res.render("projects", { 
      projects: data, 
      studentName: responseData.studentName, 
      studentId: responseData.studentId, 
      timestamp: responseData.timestamp 
    });
  };

  const handleError = err => {
    responseData.error = err;
    res.status(404).render("404", { 
      message: "No projects found for the specified sector.",
      studentName: responseData.studentName, 
      studentId: responseData.studentId, 
      timestamp: responseData.timestamp 
    });
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
    .then(project => {
      res.render("project", { 
        project: project, 
        studentName: responseData.studentName, 
        studentId: responseData.studentId, 
        timestamp: responseData.timestamp 
      });
    })
    .catch(err => {
      responseData.error = err;
      res.status(404).render("404", { 
        message: "Project not found.",
        studentName: responseData.studentName, 
        studentId: responseData.studentId, 
        timestamp: responseData.timestamp 
      });
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


app.use((req, res) => {
  res.status(404).render("404", {
    studentName: "Naisel Varghese",
    studentId: "167251222",
    timestamp: new Date(),
    message: "I'm sorry, we're unable to find what you're looking for."
  });
});

// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});