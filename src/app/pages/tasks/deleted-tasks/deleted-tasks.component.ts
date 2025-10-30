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
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrl: './deleted-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent, TasksListComponent],
})
export class DeletedTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public deletedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);

  private _destroy$: Subject<void> = new Subject<void>();
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _listenDeletedTasks(): void {
    this._taskHelperService.finishedTasks$
      .pipe(takeUntil(this._destroy$))
      .subscribe((tasks: TaskInterface[]): void => {
        this.deletedTasks.set(tasks);
      });
  }

  private _getDeletedTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          const filteredTasks: TaskInterface[] = tasks.filter(
            (task: TaskInterface): boolean =>
              task.status === this.taskStatusEnum.DELETED
          );

          this.deletedTasks.set(filteredTasks);
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
    this._listenDeletedTasks();
    this._getDeletedTasks();
  }
}
