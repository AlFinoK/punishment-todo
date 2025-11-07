import { Subject, takeUntil } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components';

import { SearchFilterComponent, TasksListComponent } from '../common';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.scss',
  imports: [SearchFilterComponent, TasksListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedTasksComponent implements OnInit, OnDestroy {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;
  protected readonly itemsPerPage: number = 8;

  private _destroy$: Subject<void> = new Subject<void>();

  protected completedTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected visibleTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected isLoadingTasks: WritableSignal<boolean> = signal(false);

  protected currentPage: WritableSignal<number> = signal(1);
  protected searchQuery: WritableSignal<string> = signal('');

  get totalItems(): number {
    return this.completedTasks()?.length || 0;
  }

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _updateVisibleTasks(filtered?: TaskInterface[]): void {
    const tasksList: TaskInterface[] = filtered ?? this.completedTasks();
    const end: number = this.currentPage() * this.itemsPerPage;
    this.visibleTasks.set(tasksList.slice(0, end));
  }

  private _filterTasks(): void {
    const query: string = this.searchQuery().trim().toLowerCase();
    const filtered: TaskInterface[] = query
      ? this.completedTasks().filter((task: TaskInterface): boolean =>
          task.name.toLowerCase().includes(query)
        )
      : this.completedTasks();

    this._updateVisibleTasks(filtered);
  }

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.COMPLETED, false)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.completedTasks.set(tasks);
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
      .subscribe((task: TaskInterface) => {
        if (task.status === TaskStatusEnum.COMPLETED) {
          this.completedTasks.update((tasks) => [task, ...(tasks || [])]);
          this._filterTasks();
        }
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface) => {
        this.completedTasks.update(
          (tasks) => tasks?.map((t) => (t._id === task._id ? task : t)) || []
        );
        this._filterTasks();
      });

    this._taskHelperService.deletedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface) => {
        this.completedTasks.update(
          (tasks) => tasks?.filter((t) => t._id !== task._id) || []
        );
        this._filterTasks();
      });
  }

  protected onLoadMore(): void {
    this.currentPage.update((page) => page + 1);
    this._updateVisibleTasks(
      this.searchQuery().trim()
        ? this.completedTasks().filter((task) =>
            task.name
              .toLowerCase()
              .includes(this.searchQuery().trim().toLowerCase())
          )
        : this.completedTasks()
    );
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
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
