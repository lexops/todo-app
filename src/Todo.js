import { addDays } from "date-fns";

export default class Todo {
  constructor(
    title,
    description = "",
    dueDate = addDays(new Date(), 1),
    priority = "low"
  ){
    this.title = title
    this.description = description
    this.dueDate = dueDate
    this.priority = priority
    this.isDone = false
  } 
  
  toggleTodo(){
    this.isDone = (this.isDone) ? false : true 
  }
}
