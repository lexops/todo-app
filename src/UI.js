import './style.scss'
import projRepo from "./ProjectRepository.js"
import Project from './Project.js'
import Todo from './Todo.js'
import { addDays, format as formatDate } from 'date-fns'

export default class UI {
  constructor() {
    this.currProjIdx = 0
  }

  firstLoad() {
    const addProjectBtn = document.querySelector("#new-project")
    addProjectBtn.addEventListener("click", (e) => {
      this.addProjectForm()
    })

    const projectsUl = document.querySelector(".projects")
    projectsUl.addEventListener("click", (e) => {
      this.switchProject(e)
    })
  }

  loadProjects() {
    const projectsUl = document.querySelector('.projects')
    projectsUl.innerHTML = ""

    projRepo.projects.forEach((project, index) => {
      const projectLi = document.createElement("li")
      projectLi.classList.add("project")
      // projectLi.dataset.index = index

      const titlePara = document.createElement("p")
      titlePara.classList.add("project-name")
      titlePara.textContent = project.name
      titlePara.dataset.index = index

      const editBtn = document.createElement("button")
      editBtn.dataset.editIndex = index
      editBtn.textContent = "Edit"
      editBtn.addEventListener("click", (e) => {
        this.editProjectForm(e, index)
      })

      const deleteBtn = document.createElement("button")
      deleteBtn.dataset.deleteIndex = index
      deleteBtn.textContent = "Delete"
      deleteBtn.addEventListener("click", (e) => {
        this.deleteProject(e)
      })

      projectLi.append(titlePara, editBtn, deleteBtn)
      projectsUl.append(projectLi)
    })

  }

  addProjectForm() {
    const template = `
      <form id="new-project" action="return">
        <label for="new-project-name">Name: </label>
        <input id="new-project-name" type="text">
        <button id="save-new-project">Save</button>
        <button id="cancel-new-project">Cancel</button>
      </form>
    `
    const dialog = document.createElement("dialog")
    dialog.innerHTML = template

    document.body.append(dialog)

    const saveBtn = dialog.querySelector("#save-new-project")
    const cancelBtn = dialog.querySelector("#cancel-new-project")
    const newProjectName = dialog.querySelector("#new-project-name")

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (newProjectName.value === "") return
      this.saveNewProject(newProjectName.value)
      newProjectName.value = ""
      this.loadProjects()
      this.loadTodos()
      projRepo.printProjects()
      dialog.close()
    })

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault()
      newProjectName.value = ""
      dialog.close()
    })

    dialog.showModal()
  }

  saveNewProject(newProject) {
    projRepo.addProject(new Project(newProject))
  }

  saveNewTodo(newTodoName, newTodoDesc, dueDate, priority) {
    projRepo.projects[this.currProjIdx].addTodo(
      (new Todo(
        newTodoName,
        newTodoDesc,
        dueDate,
        priority
      )
      )
    )

    projRepo.projects[this.currProjIdx].printTodos()
  }

  editProjectForm(e, index) {
    const template = `
      <form id="new-project" action="return">
        <label for="new-project-name">Name: </label>
        <input id="new-project-name" type="text">
        <button id="save-new-project">Save</button>
        <button id="cancel-new-project">Cancel</button>
      </form>
    `
    const dialog = document.createElement("dialog")
    dialog.innerHTML = template

    document.body.append(dialog)

    const saveBtn = dialog.querySelector("#save-new-project")
    const cancelBtn = dialog.querySelector("#cancel-new-project")
    const newProjectName = dialog.querySelector("#new-project-name")
    newProjectName.value = projRepo.projects[index].name

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault()
      this.updateProjectName(newProjectName.value, index)
      newProjectName.value = ""
      this.loadProjects()
      projRepo.printProjects()
      dialog.close()
    })

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault()
      newProjectName.value = ""
      dialog.close()
    })

    dialog.showModal()
  }

  updateProjectName(newProjectName, index) {
    projRepo.projects[index].name = newProjectName
  }

  deleteProject(e) {
    if (!e.target.dataset.deleteIndex) return

    const { deleteIndex } = e.target.dataset

    const confirmed = confirm(`Are you sure you want to delete project ${projRepo.projects[deleteIndex].name}?`)

    if (confirmed) {
      if (projRepo.projects.length === 1) {
        console.log("Last project");
        const content = document.querySelector("#content")
        content.innerHTML = ""
        projRepo.removeProject(deleteIndex)
        this.loadProjects()
        return
      }

      if (deleteIndex === this.currProjIdx) {
        this.currProjIdx = 0
        projRepo.removeProject(deleteIndex)
        this.loadProjects()
        this.loadTodos()
        return
      }

      projRepo.removeProject(deleteIndex)
      this.loadProjects()
    }
  }

  switchProject(e) {
    if (!e.target.dataset.index) return

    const { index } = e.target.dataset
    this.currProjIdx = index
    this.loadTodos()
  }

  loadTodos() {
    const contentDiv = document.querySelector("#content")
    contentDiv.innerHTML = ""

    const todosTitlePara = document.createElement("p")
    todosTitlePara.textContent = "Todos"
    todosTitlePara.style.fontWeight = 700

    const newTodoBtn = document.createElement("button")
    newTodoBtn.classList.add("new-todo")
    newTodoBtn.textContent = "+ Add todo"

    newTodoBtn.addEventListener("click", () => {
      this.addTodoForm()
    })

    const { todos } = projRepo.projects[this.currProjIdx]

    const todosUl = document.createElement("ul")
    todos.forEach((todo, index) => {
      const todoDiv = document.createElement("div")
      todoDiv.classList.add("todo")

      const toggleInput = document.createElement("input")
      toggleInput.type = "checkbox"
      toggleInput.dataset.toggleIndex = index
      toggleInput.addEventListener("click", (e) => {
        this.toggleTodo(e)
        projRepo.projects[this.currProjIdx].printTodos()
      })

      if (projRepo.projects[this.currProjIdx].todos[index].isDone) {
        toggleInput.checked = true
      }

      const titlePara = document.createElement("p")
      titlePara.textContent = todo.title

      const dueDatePara = document.createElement("p")
      dueDatePara.textContent = formatDate(todo.dueDate, 'MMM d')

      const editBtn = document.createElement("button")
      editBtn.dataset.editIndex = index
      editBtn.textContent = "Edit"
      editBtn.addEventListener("click", (e) => {
        this.editTodo(e)
      })

      const deleteBtn = document.createElement("button")
      deleteBtn.dataset.deleteIndex = index
      deleteBtn.textContent = "Delete"
      deleteBtn.addEventListener("click", (e) => {
        this.deleteTodo(e)
      })

      todoDiv.append(toggleInput, titlePara, dueDatePara, editBtn, deleteBtn)
      todosUl.append(todoDiv)
    })

    contentDiv.append(todosTitlePara, newTodoBtn, todosUl)
  }

  toggleTodo(e) {
    if (!e.target.dataset.toggleIndex) return

    const index = e.target.dataset.toggleIndex
    const todo = projRepo.projects[this.currProjIdx].todos[index]

    todo.toggleTodo()
  }

  editTodo(e) {
    if (!e.target.dataset.editIndex) return

    const { editIndex } = e.target.dataset

    console.log(`Editing todo index ${editIndex}`);

    this.editTodoForm(editIndex)
  }

  deleteTodo(e) {
    if (!e.target.dataset.deleteIndex) return

    const { deleteIndex } = e.target.dataset

    const confirmed = confirm(`Are you sure you want to delete this todo?`)

    if (confirmed) {
      projRepo.projects[this.currProjIdx].removeTodo(deleteIndex)
      this.loadTodos()
      return
    }
  }

  addTodoForm() {
    const template = `
      <form id="new-todo" action="return">

        <p>
          <label for="new-todo-name">Name: </label>
          <input 
            type="text"
            id="new-todo-name" 
            name="new-todo-name">
        </p>

        <p>
          <label for="new-todo-desc">Description:</label>
          <input 
            type="text"
            id="new-todo-desc" 
            name="new-todo-desc">
        </p>
        <p>
          <label for="due-date">Due Date:</label>
          <input 
            type="date" 
            id="due-date"
            name="due-date"
            value="${formatDate(addDays(new Date(), 1), 'yyyy-MM-dd')}" />
        </p>
        <p>
          <label for="priority">Priority: </label>
          <select id="priority" name="priority">
            <option value="low" selected>Low</option>
            <option value="medium" >Medium</option>
            <option value="high">High</option>
          </select>
        </p>

        <button id="save-new-todo">Save</button>
        <button id="cancel-new-todo">Cancel</button>

      </form>
    `
    const dialog = document.createElement("dialog")
    dialog.innerHTML = template

    document.body.append(dialog)

    const saveBtn = dialog.querySelector("#save-new-todo")
    const cancelBtn = dialog.querySelector("#cancel-new-todo")
    const newTodoName = dialog.querySelector("#new-todo-name")
    const newTodoDesc = dialog.querySelector("#new-todo-desc")
    const dueDate = dialog.querySelector("#due-date")
    const priority = dialog.querySelector("#priority")

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (newTodoName.value === "") return

      console.log(
        'priority', priority.options[priority.selectedIndex].value
      );

      this.saveNewTodo(
        newTodoName.value,
        newTodoDesc.value,
        new Date(dueDate.value),
        priority.options[priority.selectedIndex].value
      )

      newTodoName.value = ""
      this.loadTodos()
      dialog.close()
    })

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault()
      newTodoName.value = ""
      dialog.close()
    })

    dialog.showModal()
  }

  editTodoForm(index) {
    const template = `
      <form id="new-todo" action="return">

        <p>
          <label for="new-todo-name">Name: </label>
          <input 
            type="text"
            id="new-todo-name" 
            name="new-todo-name">
        </p>

        <p>
          <label for="new-todo-desc">Description:</label>
          <input 
            type="text"
            id="new-todo-desc" 
            name="new-todo-desc">
        </p>
        <p>
          <label for="due-date">Due Date:</label>
          <input 
            type="date" 
            id="due-date"
            name="due-date"
            value="" />
        </p>
        <p>
          <label for="priority">Priority: </label>
          <select id="priority" name="priority">
            <option value="low" selected>Low</option>
            <option value="medium" >Medium</option>
            <option value="high">High</option>
          </select>
        </p>

        <button id="save-new-todo">Save</button>
        <button id="cancel-new-todo">Cancel</button>

      </form>
    `
    const dialog = document.createElement("dialog")
    dialog.innerHTML = template

    document.body.append(dialog)

    const saveBtn = dialog.querySelector("#save-new-todo")
    const cancelBtn = dialog.querySelector("#cancel-new-todo")
    const todoName = dialog.querySelector("#new-todo-name")
    const todoDesc = dialog.querySelector("#new-todo-desc")
    const todoDueDate = dialog.querySelector("#due-date")
    const todoPriority = dialog.querySelector("#priority")
    todoName.value = projRepo.projects[this.currProjIdx].todos[index].title
    todoDesc.value = projRepo.projects[this.currProjIdx].todos[index].description
    todoDueDate.value = formatDate(projRepo.projects[this.currProjIdx].todos[index].dueDate, 'yyyy-MM-dd')
    todoPriority.value = projRepo.projects[this.currProjIdx].todos[index].priority

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault()
      this.updateTodo(index, [
        todoName.value,
        todoDesc.value,
        todoDueDate.value,
        todoPriority.value])
      this.loadTodos()
      dialog.close()
    })

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault()
      todoName.value = ""
      todoDesc.value = ""
      todoDueDate.value = ""
      todoPriority.value = ""
      dialog.close()
    })

    dialog.showModal()
  }

  updateTodo(index, [title, desc, dueDate, priority]) {
    const todo = projRepo.projects[this.currProjIdx].todos[index]

    todo.title = title
    todo.description = desc
    todo.dueDate = dueDate
    todo.priority = priority
  }
}

