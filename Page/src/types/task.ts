export interface ITask {
  _id?: string;
  message: string;
  time?: Date | string;
  type?: number;
  finish?: boolean;
  tag?: string;
  workTime: string;
}

export interface IFocusTaskData {
  title: string;
  progress: number;
  task: {
    message: string;
    id: string;
  };
  timeLength: number;
  startTime: Date;
  endTime: Date;
}
