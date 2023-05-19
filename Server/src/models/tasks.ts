const TodoList = require("@/models/schema/todoList");
export const findTasksByQueryRule = async (queryRule) => {
  return TodoList.find(queryRule);
};

export const findOneTaskByQueryRule = async (queryRule) => {
  return TodoList.findOne(queryRule);
};
export const updateTodo = async (task) => {
  return TodoList.updateOne({ _id: task._id }, task);
};
export const createTodo = async (task) => {
  return new TodoList(task).save();
};

export const deleteTodo = async (task) => {
  return TodoList.findOneAndDelete(task);
};
