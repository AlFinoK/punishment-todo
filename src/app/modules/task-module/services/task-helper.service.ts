import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskInterface } from '../interfaces';
import { TaskStatusEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class TaskHelperService {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public tasks$: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<
    TaskInterface[]
  >([]);
  public isLoadingTasks$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  public filterDeletedTasks(tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter(
      (task: TaskInterface): boolean =>
        task.status === this.taskStatusEnum.DELETED
    );
  }

  public filterFinishedTasks(tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter(
      (task: TaskInterface): boolean =>
        task.status === this.taskStatusEnum.FINISHED
    );
  }

  public filterImportantTasks(tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task: TaskInterface): boolean => task.isImportant);
  }

  public updateTasks(newTask: TaskInterface): void {
    const currentTasks: TaskInterface[] = this.tasks$.getValue();
    this.tasks$.next([...currentTasks, newTask]);
  }
}
