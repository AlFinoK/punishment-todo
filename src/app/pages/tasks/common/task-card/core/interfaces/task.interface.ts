import { TaskFeaturesInterface } from './task-features.interface';

export interface TaskInterface {
  id: number;
  title: string;
  description: string;
  isImportant: boolean;
  isFinished: boolean;
  created_at: string;
  features: TaskFeaturesInterface[];
}
