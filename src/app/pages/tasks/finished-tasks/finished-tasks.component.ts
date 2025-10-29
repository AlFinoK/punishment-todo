import { Component, signal, WritableSignal } from '@angular/core';

import {
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';

import {
  SearchFilterComponent,
  PageTitleComponent,
  TasksListComponent,
} from '../common';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '@shared/components/alert/core';
import { TaskHelperService } from '@modules/task-module/services/task-helper.service';

@Component({
  selector: 'app-finished-tasks',
  templateUrl: './finished-tasks.component.html',
  styleUrl: './finished-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent, TasksListComponent],
})
export class FinishedTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public finishedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);

  private _destroy$: Subject<void> = new Subject<void>();
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _listenFinishedTasks(): void {
    this._taskHelperService.finishedTasks$
      .pipe(takeUntil(this._destroy$))
      .subscribe((tasks: TaskInterface[]): void => {
        this.finishedTasks.set(tasks);
      });
  }

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
    this._listenFinishedTasks();
    this._getFinishedTasks();
  }
}
