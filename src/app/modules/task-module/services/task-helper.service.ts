import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { tags } from '@shared/data';

import { TaskInterface, TaskTagsInterface } from '../interfaces';
import { TaskStatusEnum, TaskTagValueEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class TaskHelperService {
  protected readonly tags: TaskTagsInterface[] = tags;
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;

  public createdTask$: Subject<TaskInterface> = new Subject<TaskInterface>();
  public deletedTask$: Subject<TaskInterface> = new Subject<TaskInterface>();
  public updatedTask$: Subject<TaskInterface> = new Subject<TaskInterface>();
  public activeTags$: BehaviorSubject<TaskTagsInterface[]> =
    new BehaviorSubject<TaskTagsInterface[]>([]);

  constructor() {}

  public filterTasksByTag(tag: TaskTagsInterface): void {
    const activeTags: TaskTagsInterface[] = this.activeTags$.getValue();
    const index: number = activeTags.findIndex(
      (activeTag: TaskTagsInterface): boolean => activeTag.value === tag.value
    );

    if (index === -1) {
      activeTags.push(tag);
    } else {
      activeTags.splice(index, 1);
    }

    this.activeTags$.next([...activeTags]);
  }

  public filterTasksPerRender(
    status: TaskStatusEnum,
    tasks: TaskInterface[],
    isImportant?: boolean
    // @ts-ignore
  ): TaskInterface[] {
    const inProgress: boolean = status === this.taskStatusEnum.IN_PROGRESS;
    const completed: boolean = status === this.taskStatusEnum.COMPLETED;
    const deleted: boolean = status === this.taskStatusEnum.DELETED;

    if (inProgress) {
      return tasks.filter(
        (task: TaskInterface): boolean =>
          task.status === this.taskStatusEnum.IN_PROGRESS
      );
    }

    if (isImportant && inProgress) {
      return tasks.filter(
        (task: TaskInterface): boolean =>
          task.isImportant && task.status === this.taskStatusEnum.IN_PROGRESS
      );
    }

    if (completed) {
      return tasks.filter(
        (task: TaskInterface): boolean =>
          task.status === this.taskStatusEnum.COMPLETED
      );
    }

    if (deleted) {
      return tasks.filter(
        (task: TaskInterface): boolean =>
          task.status === this.taskStatusEnum.DELETED
      );
    }
  }
}
