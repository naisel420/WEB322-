/********************************************************************************
 * WEB322 – Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Naisel Varghese Student ID: 167251222 Date: 2025-04-10
 *
 * 
 ********************************************************************************/
require('dotenv').config();

const clientSessions = require('client-sessions');
const authData = require('./modules/auth-service');
const express = require("express");
const path = require("path");
const projectData = require(path.join(__dirname, "modules", "projects.js"));
const app = express();
const HTTP_PORT = process.env.PORT || 8081;

app.use(express.urlencoded({ extended: true }));
app.use(clientSessions({
    cookieName: 'session',
    secret: 'your_secret_key', 
    duration: 2 * 60 * 60 * 1000, 
    activeDuration: 1000 * 60 * 60 
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}




app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.json());


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
    console.log("DEBUG - Requested sector:", sector);
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

app.get("/solutions/editProject/:id", ensureLogin, (req, res) => {
    const projectId = req.params.id;

    Promise.all([
        projectData.getProjectById(projectId),
        projectData.getAllSectors()
    ])
    .then(([project, sectors]) => {
        res.render("editProject", {
            sectors: sectors,
            project: project,
            studentName: "Naisel Varghese",
            studentId: "167251222",
            timestamp: new Date()
        });
    })
    .catch(err => {
        console.error(err);
        res.status(404).render("404", {
            message: "Project not found.",
            studentName: "Naisel Varghese",
            studentId: "167251222",
            timestamp: new Date()
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



app.get("/solutions/addProject", ensureLogin,(req, res) => {
    projectData.getAllSectors()
        .then(sectors => {
            res.render("addProject", {
                sectors: sectors,
                studentName: "Naisel Varghese",
                studentId: "167251222",
                timestamp: new Date()
            });
        })
        .catch(err => {
            res.status(500).render("500", {
                message: `Unable to retrieve sectors: ${err}`,
                studentName: "Naisel Varghese",
                studentId: "167251222",
                timestamp: new Date()
            });
        });
});

app.post("/solutions/addProject", ensureLogin,(req, res) => {
    projectData.addProject(req.body)
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch(err => {
            res.status(500).render("500", {
                message: `Unable to add project: ${err}`,
                studentName: "Naisel Varghese",
                studentId: "167251222",
                timestamp: new Date()
            });
        });
});


app.get('/login', (req, res) => {
    res.render('login', {
        errorMessage: '',
        userName: '',
        studentName: "Naisel Varghese",
        studentId: "167251222",
        timestamp: new Date()
    });
});

app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/solutions/projects');
        })
        .catch((err) => {
            res.render('login', {
                errorMessage: err,
                userName: req.body.userName,
                studentName: "Naisel Varghese",
                studentId: "167251222",
                timestamp: new Date()
            });
        });
});

// Register routes
app.get('/register', (req, res) => {
    res.render('register', {
        errorMessage: '',
        successMessage: '',
        userName: '',
        studentName: "Naisel Varghese",
        studentId: "167251222",
        timestamp: new Date()
    });
});

app.post('/register', (req, res) => {
    authData.registerUser(req.body)
        .then(() => {
            res.render('register', {
                errorMessage: '',
                successMessage: 'User created',
                userName: '',
                studentName: "Naisel Varghese",
                studentId: "167251222",
                timestamp: new Date()
            });
        })
        .catch((err) => {
            res.render('register', {
                errorMessage: err,
                successMessage: '',
                userName: req.body.userName,
                studentName: "Naisel Varghese",
                studentId: "167251222",
                timestamp: new Date()
            });
        });
});


app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});


app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory', {
        studentName: "Naisel Varghese",
        studentId: "167251222",
        timestamp: new Date()
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


projectData.initialize()
    .then(() => {
        console.log('PostgreSQL initialized successfully');
        return authData.initialize(); 
    })
    .then(() => {
        console.log('MongoDB initialized successfully');
        
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.log(`Unable to start server: ${err}`);
    });
