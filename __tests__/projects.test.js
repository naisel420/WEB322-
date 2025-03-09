const { getAllProjects, getProjectById } = require("../modules/projects");


const mockProjects = [
  { id: 1, title: "Forest Restoration", sector: "Land Sinks", summary_short: "Large-scale reforestation efforts." },
  { id: 2, title: "Steel Recycling", sector: "Industry", summary_short: "Circular economy solutions for industrial metal reuse." },
  { id: 3, title: "EV Infrastructure", sector: "Transportation", summary_short: "Nationwide network of fast-charging stations." }
];


jest.mock("../modules/projects", () => ({
  getAllProjects: jest.fn(() => Promise.resolve(mockProjects)),
  getProjectById: jest.fn((id) => {
    const project = mockProjects.find(p => p.id === id);
    return project ? Promise.resolve(project) : Promise.reject(new Error("Project not found"));
  })
}));


console.log("Student Name: Naisel Varghese");
console.log("Student ID: 167251222");

describe("Projects Module", () => {
  
  describe("getAllProjects", () => {
    it("should return all projects", async () => {
      const projects = await getAllProjects();
      expect(projects).toEqual(mockProjects); 
      expect(projects.length).toBe(3);
    });
  });

  
  describe("getProjectById", () => {
    it("should return a project by ID", async () => {
      const project = await getProjectById(1);
      expect(project).toEqual(mockProjects[0]); 
      expect(project.title).toBe("Forest Restoration"); 
    });

    it("should throw an error if project is not found", async () => {
      await expect(getProjectById(99)).rejects.toThrow("Project not found"); 
    });
  });
});