import { TaskStatusEnum, TaskTagValueEnum } from '../enums';

export interface TaskInterface {
  _id: string;
  name: string;
  status: TaskStatusEnum;
  description: string;
  isImportant: boolean;
  endTime: string;
  endDate: string;
  tags: TaskTagValueEnum[];
}
