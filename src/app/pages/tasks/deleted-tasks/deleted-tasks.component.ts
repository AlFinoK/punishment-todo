import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components';

import { SearchFilterComponent, TasksListComponent } from '../common';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrl: './deleted-tasks.component.scss',
  imports: [SearchFilterComponent, TasksListComponent],
})
export class DeletedTasksComponent implements OnInit {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected deletedTasks: WritableSignal<TaskInterface[]> = signal<
    TaskInterface[]
  >([]);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);
  protected currentPage: WritableSignal<number> = signal<number>(1);
  protected tasksPerPage: number = 8;

  private _destroy$: Subject<void> = new Subject<void>();

  get totalItems(): number {
    return this.deletedTasks()?.length || 0;
  }

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.DELETED)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.deletedTasks.set(tasks);
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
        this.deletedTasks.update(
          (tasks: TaskInterface[] | null): TaskInterface[] => [
            task,
            ...(tasks || []),
          ]
        );
        const filteredTasks: TaskInterface[] = this.deletedTasks().filter(
          (task: TaskInterface): boolean => task.isImportant
        );

        this.deletedTasks.set(filteredTasks);
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.deletedTasks.update(
          (tasks: TaskInterface[] | null): TaskInterface[] => {
            return (
              tasks?.map((sourceTask: TaskInterface) =>
                sourceTask._id === task._id ? task : sourceTask
              ) || []
            );
          }
        );
      });
  }

  // protected onLoadMore(): void {
  //   const displayedTasks: TaskInterface[] | null = this.displayedTasks();
  //   const deletedTasks: TaskInterface[] | null = this.deletedTasks();

  //   if (deletedTasks && displayedTasks) {
  //     const nextPage: number = this.currentPage() + 1;
  //     const newTasks: TaskInterface[] = deletedTasks.slice(
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
}
