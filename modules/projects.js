const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
      try {
        projectData.forEach((item) => {
          item.sector = sectorData.find(
            (sectorItem) => sectorItem.id === item.sector_id
          ).sector_name;
          projects.push(item);
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function getAllProjects() {
    return new Promise((resolve, reject) => resolve(projects));
  }
  
  function getProjectById(projectId) {
    let result = projects.find((project) => project.id === projectId);
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result);
      } else {
        reject("Unable to find requested project");
      }
    });
  }
  
  function getProjectsBySector(sector) {
    let result = projects.filter((project) =>
      project.sector.toLowerCase().includes(sector.toLowerCase())
    );
    return new Promise((resolve, reject) => {
      if (result.length != 0) {
        resolve(result);
      } else {
        reject("Unable to find requested project");
      }
    });
  }
  
  module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector }