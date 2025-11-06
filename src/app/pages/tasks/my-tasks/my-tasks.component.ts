import { Subject, takeUntil } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components';

import {
  TasksListComponent,
  SearchFilterComponent,
  PaginationComponent,
} from '../common';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
  imports: [TasksListComponent, SearchFilterComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTasksComponent implements OnInit, OnDestroy {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;
  protected readonly itemsPerPage: number = 8;

  private readonly _destroy$: Subject<void> = new Subject<void>();

  protected allTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected visibleTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected isLoadingTasks: WritableSignal<boolean> = signal(false);

  protected currentPage: WritableSignal<number> = signal(1);
  protected searchQuery: WritableSignal<string> = signal('');

  get totalItems(): number {
    return this.allTasks()?.length || 0;
  }

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _updateVisibleTasks(filtered?: TaskInterface[]): void {
    const tasksList: TaskInterface[] = filtered ?? this.allTasks();
    const end: number = this.currentPage() * this.itemsPerPage;
    const sliced: TaskInterface[] = tasksList.slice(0, end);
    this.visibleTasks.set(sliced);
  }

  private _filterTasks(): void {
    const query: string = this.searchQuery().trim().toLowerCase();

    if (query) {
      this.allTasks.set(
        this.allTasks().filter((task: TaskInterface): boolean =>
          task.name.toLowerCase().includes(query)
        )
      );
    }

    this._updateVisibleTasks(this.allTasks());
  }

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.IN_PROGRESS, false)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.allTasks.set(tasks);
          this._filterTasks();
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
        this.allTasks.update((tasks: TaskInterface[]): TaskInterface[] => [
          task,
          ...(tasks || []),
        ]);
        this._filterTasks();
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.allTasks.update(
          (tasks: TaskInterface[]): TaskInterface[] =>
            tasks?.map(
              (sourceTask: TaskInterface): TaskInterface =>
                sourceTask._id === task._id ? sourceTask : task
            ) || []
        );
        this._filterTasks();
      });

    this._taskHelperService.deletedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface) => {
        this.allTasks.update(
          (tasks: TaskInterface[]): TaskInterface[] =>
            tasks?.filter(
              (sourceTask: TaskInterface): boolean =>
                sourceTask._id !== task._id
            ) || []
        );
        this._filterTasks();
      });
  }

  protected onLoadMore(): void {
    this.currentPage.update((page: number): number => page + 1);
    this._updateVisibleTasks(
      this.searchQuery().trim()
        ? this.allTasks().filter((task: TaskInterface): boolean =>
            task.name
              .toLowerCase()
              .includes(this.searchQuery().trim().toLowerCase())
          )
        : this.allTasks()
    );
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this._filterTasks();
  }

  ngOnInit(): void {
    this._getAllTasks();
    this._listenTasksStatuses();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
