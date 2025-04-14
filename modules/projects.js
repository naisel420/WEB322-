require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    }
});

const Sector = sequelize.define('Sector', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sector_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    feature_img_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    summary_short: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    intro_short: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    impact: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    original_source_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sector_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                console.log('Database synced successfully');
                resolve();
            })
            .catch((err) => {
                console.log('Unable to sync the database:', err);
                reject(err);
            });
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            include: [Sector],
        })
            .then((projects) => {
                resolve(projects);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        Project.findOne({
            where: { id: projectId },
            include: [Sector],
        })
            .then((project) => {
                if (project) {
                    resolve(project);
                } else {
                    reject('Unable to find requested project');
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector],
      where: {
        '$Sector.sector_name$': {
          [Op.iLike]: `%${sector.trim().replace('+', ' ')}%`
        }
      }
    })
    .then((projects) => {
      
      resolve(projects);
    })
    .catch((err) => {
      reject("Database error: " + err);
    });
  });
}



function getAllSectors() {
    return new Promise((resolve, reject) => {
        Sector.findAll()
            .then((sectors) => {
                resolve(sectors);
            })
            .catch((err) => {
                reject('Unable to retrieve sectors: ' + err.message);
            });
    });
}

function addProject(projectData) {
    return new Promise((resolve, reject) => {
        Project.create(projectData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject('Unable to add project: ' + err.errors[0].message);
            });
    });
}

function editProject(id, projectData) {
    return new Promise((resolve, reject) => {
        Project.update(projectData, {
            where: { id: id },
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject('Unable to update project: ' + err.errors[0].message);
            });
    });
}

function deleteProject(id) {
    return new Promise((resolve, reject) => {
        Project.destroy({
            where: { id: id },
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject('Unable to delete project: ' + err.errors[0].message);
            });
    });
}

module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector,
    getAllSectors,
    addProject,
    editProject,
    deleteProject,
    Sector,
    Project,
};
