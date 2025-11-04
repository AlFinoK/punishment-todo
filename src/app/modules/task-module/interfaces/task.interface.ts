import { TaskStatusEnum } from '../enums';
import { TaskTagsInterface } from './task-tags.interface';

export interface TaskInterface {
  _id: string;
  name: string;
  status: TaskStatusEnum;
  description: string;
  isImportant: boolean;
  endTime: string;
  endDate: string;
  tags: string[];
}
