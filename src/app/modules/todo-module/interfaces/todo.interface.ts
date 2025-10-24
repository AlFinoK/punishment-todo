import { TodoTagsInterface } from './todo-tags.interface';

export interface TodoInterface {
  id: number;
  title: string;
  description: string;
  isImportant: boolean;
  dateOfCompletion: string;
  tags: TodoTagsInterface[];
  dateAndTimeOfCompletion: string;
}
