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
  TaskTagsInterface,
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

  protected allTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected visibleTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected isLoadingTasks: WritableSignal<boolean> = signal(false);

  protected currentPage: WritableSignal<number> = signal(1);
  protected readonly itemsPerPage = 5;

  protected searchQuery: WritableSignal<string> = signal('');

  private readonly _destroy$ = new Subject<void>();

  get totalItems(): number {
    return this.allTasks()?.length || 0;
  }

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _updateVisibleTasks(filtered?: TaskInterface[]): void {
    const tasksList = filtered ?? this.allTasks();
    const end = this.currentPage() * this.itemsPerPage;
    const sliced = tasksList.slice(0, end);
    this.visibleTasks.set(sliced);
  }

  private _filterTasks(): void {
    const query = this.searchQuery().trim().toLowerCase();
    let filtered = this.allTasks();
    if (query) {
      filtered = filtered.filter((task) =>
        task.name.toLowerCase().includes(query)
      );
    }
    // сбрасываем страницу, если нужно
    this.currentPage.set(1);
    this._updateVisibleTasks(filtered);
  }

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.IN_PROGRESS, false)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (tasks: TaskInterface[]) => {
          this.allTasks.set(tasks);
          this._filterTasks(); // сразу применяем фильтрацию + пагинацию
          this.isLoadingTasks.set(false);

          this._alertService
            .open('Tasks successfully loaded', { variant: 'success' })
            .subscribe();
        },
        error: () => {
          this.isLoadingTasks.set(false);
          this._alertService
            .open('Failed to load tasks', { variant: 'error' })
            .subscribe();
        },
      });
  }

  private _listenTasksStatuses(): void {
    this._taskHelperService.createdTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface) => {
        this.allTasks.update((tasks) => [task, ...(tasks || [])]);
        this._filterTasks();
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface) => {
        this.allTasks.update(
          (tasks) => tasks?.map((t) => (t._id === task._id ? task : t)) || []
        );
        this._filterTasks();
      });

    this._taskHelperService.deletedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface) => {
        this.allTasks.update(
          (tasks) => tasks?.filter((t) => t._id !== task._id) || []
        );
        this._filterTasks();
      });
  }

  protected onLoadMore(): void {
    this.currentPage.update((p) => p + 1);
    this._filterTasks(); // или _updateVisibleTasks() с текущим фильтром
    console.log('visibleTasks now:', this.visibleTasks());
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
