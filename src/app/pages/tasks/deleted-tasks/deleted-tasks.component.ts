import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components/alert/core';

import {
  SearchFilterComponent,
  PageTitleComponent,
  TasksListComponent,
} from '../common';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrl: './deleted-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent, TasksListComponent],
})
export class DeletedTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected deletedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

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
    this._getDeletedTasks();
  }
}
