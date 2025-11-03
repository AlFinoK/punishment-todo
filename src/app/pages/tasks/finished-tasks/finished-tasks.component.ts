import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components/alert/core';

import { SearchFilterComponent, TasksListComponent } from '../common';

@Component({
  selector: 'app-finished-tasks',
  templateUrl: './finished-tasks.component.html',
  styleUrl: './finished-tasks.component.scss',
  imports: [SearchFilterComponent, TasksListComponent],
})
export class FinishedTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected finishedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _getFinishedTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          const filteredTasks: TaskInterface[] = tasks.filter(
            (task: TaskInterface): boolean =>
              task.status === this.taskStatusEnum.FINISHED
          );

          this.finishedTasks.set(filteredTasks);
          this.isLoadingTasks.set(false);
          this._alertService.open('Tasks successfully loaded', {
            variant: 'success',
          });
        },

        (): void => {
          this.isLoadingTasks.set(false);
          this._alertService.open('Failed to load tasks', {
            variant: 'error',
          });
        }
      );
  }

  ngOnInit(): void {
    this._getFinishedTasks();
  }
}
