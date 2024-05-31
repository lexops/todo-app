import Todo from "./Todo.js"
import Project from "./Project.js"
import UI from "./UI.js"
import projRepo from "./ProjectRepository.js"

const project1 = new Project("foo")
const project2 = new Project("bar")
const todo1 = new Todo("Study DSA")
const todo2 = new Todo("Finish CRUD")

project1.addTodo(todo1)
project2.addTodo(todo2)

projRepo.addProject(project1)
projRepo.addProject(project2)

const ui = new UI()
ui.firstLoad()
ui.loadProjects()
ui.loadTodos()


