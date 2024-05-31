 class ProjectRepository {
   constructor(projects = []){
     this.projects = projects
   }

   printProjects(){
     console.table(this.projects)
   }

   addProject(project){
     this.projects.push(project)
   }

   removeProject(projectIndex){
     this.projects.splice(projectIndex, 1)
   }
 }

 const projRepo = new ProjectRepository()
 export default projRepo
