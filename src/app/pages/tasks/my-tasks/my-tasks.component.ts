import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
  TaskTagsInterface,
} from '@modules/task-module';
import { AlertService } from '@shared/components';

import { TasksListComponent, SearchFilterComponent } from '../common';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
  imports: [TasksListComponent, SearchFilterComponent],
})
export class MyTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected tasks: WritableSignal<TaskInterface[]> = signal<TaskInterface[]>(
    []
  );

  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);
  protected currentPage: WritableSignal<number> = signal<number>(1);
  protected tasksPerPage: number = 8;

  private _destroy$: Subject<void> = new Subject<void>();

  get totalItems(): number {
    return this.tasks()?.length || 0;
  }

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.IN_PROGRESS, false)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.tasks.set(tasks);
          this.isLoadingTasks.set(false);

          this._alertService
            .open('Tasks successfully loaded', { variant: 'success' })
            .subscribe();
        },

        (): void => {
          this.isLoadingTasks.set(false);
          this._alertService
            .open('Failed to load tasks', { variant: 'error' })
            .subscribe();
        }
      );
  }

  private _listenTasksStatuses(): void {
    this._taskHelperService.createdTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.tasks.update((tasks: TaskInterface[] | null): TaskInterface[] => [
          task,
          ...(tasks || []),
        ]);
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.tasks.update((tasks: TaskInterface[] | null): TaskInterface[] => {
          return (
            tasks?.map(
              (sourceTask: TaskInterface): TaskInterface =>
                sourceTask._id === task._id ? task : sourceTask
            ) || []
          );
        });
      });

    this._taskHelperService.deletedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.tasks.update((tasks: TaskInterface[] | null): TaskInterface[] => {
          return (
            tasks?.filter((sourceTask: TaskInterface) => {
              return sourceTask._id !== task._id;
            }) || []
          );
        });
      });
  }

  // protected onLoadMore(): void {
  //   const displayedTasks: TaskInterface[] | null = this.displayedTasks();
  //   const tasks: TaskInterface[] | null = this.tasks();

  //   if (tasks && displayedTasks) {
  //     const nextPage: number = this.currentPage() + 1;
  //     const newTasks: TaskInterface[] = tasks.slice(
  //       nextPage * this.tasksPerPage,
  //       (nextPage + 1) * this.tasksPerPage
  //     );

  //     this.displayedTasks.set([...displayedTasks, ...newTasks]);
  //     this.currentPage.set(nextPage);
  //   }
  // }

  ngOnInit(): void {
    this._getAllTasks();
    this._listenTasksStatuses();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
