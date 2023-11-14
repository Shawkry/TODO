export interface ITask {
  _id?: string;
  finish?: boolean;
  tag: string;
  workTime: number;
  message?: string;
  type: number;
  time: Date;
  user: string;
}
export interface IQueryTask {
  _id?: string;
  finish?: boolean;
  tag?: string;
  workTime?: number;
  message?: string;
  type?: number;
  time?: { $gte: Date; $lt: Date };
  user?: string;
}
