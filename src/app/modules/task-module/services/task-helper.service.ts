import { Injectable } from '@angular/core';

import { TaskInterface } from '../interfaces';

import { TaskStatusEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class TaskHelperService {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  constructor() {}

  public filterTasks(
    tasks: TaskInterface[],
    status: TaskStatusEnum,
    isImportant?: boolean,
    excludeStatuses: TaskStatusEnum[] = []
  ): TaskInterface[] {
    const filteredTasks: TaskInterface[] = tasks.filter(
      (task: TaskInterface): boolean => !excludeStatuses.includes(task.status)
    );

    if (isImportant) {
      filteredTasks.filter((task: TaskInterface): boolean => task.isImportant);
    }

    switch (status) {
      case this.taskStatusEnum.DELETED:
        return filteredTasks;
      case this.taskStatusEnum.FINISHED:
        return filteredTasks;
      default:
        return filteredTasks;
    }
  }
}
