import { Status, Priority, Type } from '../../common/enums';

export class TodoList {
  id: number;
  title?: string;
  assigne?: string;
  dueDate: Date;
  timeTracked: number;
  status: Status;
  priority?: Priority;
  type?: Type;
  estimatedSp?: number;
  actualSp?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TodoList>) {
    Object.assign(this, partial);
  }
}