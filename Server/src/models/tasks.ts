import type { ITask, IQueryTask } from "@/types";

import TodoList from "@/models/schema/todoList";
export const findTasksByQueryRule = async (
  queryRule: IQueryTask,
): Promise<ITask[]> => {
  return TodoList.find(queryRule);
};

export const findOneTaskByQueryRule = async (
  queryRule: IQueryTask,
): Promise<ITask> => {
  return TodoList.findOne(queryRule);
};
export const updateTodo = async (task: ITask) => {
  return TodoList.updateOne({ _id: task._id }, task);
};
export const createTodo = async (task: ITask) => {
  return new TodoList(task).save();
};

export const deleteTodo = async (task: IQueryTask) => {
  return TodoList.findOneAndDelete(task);
};
