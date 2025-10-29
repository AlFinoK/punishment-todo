import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskInterface } from '../interfaces';
import { TaskStatusEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class TaskHelperService {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public allTasks$: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<
    TaskInterface[]
  >([]);
  public importantTasks$: BehaviorSubject<TaskInterface[]> =
    new BehaviorSubject<TaskInterface[]>([]);
  public deletedTasks$: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<
    TaskInterface[]
  >([]);
  public finishedTasks$: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<
    TaskInterface[]
  >([]);
  public isLoadingTasks$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  public updateTasks(newTask: TaskInterface): void {
    const currentTasks: TaskInterface[] = this.allTasks$.getValue();
    this.allTasks$.next([...currentTasks, newTask]);
  }
}
