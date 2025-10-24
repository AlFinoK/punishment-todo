import { TodoTagsInterface } from './todo-tags.interface';

export interface CreateTodoRequestInterface {
  title: string;
  description: string;
  isImportant: boolean;
  dateOfCompletion: string;
  tags: TodoTagsInterface[];
  dateAndTimeOfCompletion: string;
}
