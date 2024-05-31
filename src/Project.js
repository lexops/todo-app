export default class Project {
  constructor(name, todos = []){
    this.name = name
    this.todos = todos
  } 

  printTodos(){
    console.table(this.todos)
  }

  editName(newName){
    this.name = newName
  }

  addTodo(todo){
    this.todos.push(todo)
  }

  removeTodo(todoIndex){
    this.todos.splice(todoIndex, 1)
  }
}
