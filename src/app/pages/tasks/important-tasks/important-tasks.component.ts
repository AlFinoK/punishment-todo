import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components';

import {
  SearchFilterComponent,
  TasksListComponent,
  PaginationComponent,
} from '../common';

@Component({
  selector: 'app-important-tasks',
  templateUrl: './important-tasks.component.html',
  styleUrl: './important-tasks.component.scss',
  imports: [SearchFilterComponent, TasksListComponent, PaginationComponent],
})
export class ImportantTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  private _destroy$: Subject<void> = new Subject<void>();

  protected importantTasks: WritableSignal<TaskInterface[]> = signal<
    TaskInterface[]
  >([]);
  protected visibleTasks: WritableSignal<TaskInterface[]> = signal([]);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  protected currentPage: WritableSignal<number> = signal(1);
  protected readonly itemsPerPage = 8;

  protected searchQuery: WritableSignal<string> = signal('');

  get totalItems(): number {
    return this.importantTasks()?.length || 0;
  }

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _updateVisibleTasks(filtered?: TaskInterface[]): void {
    const tasksList: TaskInterface[] = filtered ?? this.importantTasks();
    const end: number = this.currentPage() * this.itemsPerPage;
    const sliced: TaskInterface[] = tasksList.slice(0, end);
    this.visibleTasks.set(sliced);
  }

  private _filterTasks(): void {
    const query: string = this.searchQuery().trim().toLowerCase();

    const filtered: TaskInterface[] = query
      ? this.importantTasks().filter((task: TaskInterface): boolean =>
          task.name.toLowerCase().includes(query)
        )
      : this.importantTasks();

    this._updateVisibleTasks(filtered);
  }

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.IN_PROGRESS, true)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.importantTasks.set(tasks);
          this._filterTasks();
          this.isLoadingTasks.set(false);

          this._alertService
            .open('Tasks successfully loaded', {
              variant: 'success',
            })
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
        this.importantTasks.update(
          (tasks: TaskInterface[] | null): TaskInterface[] =>
            task.isImportant ? [task, ...(tasks || [])] : tasks || []
        );

        const filteredTasks: TaskInterface[] = this.importantTasks().filter(
          (task: TaskInterface): boolean => task.isImportant
        );

        this.importantTasks.set(filteredTasks);
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.importantTasks.update((tasks: TaskInterface[] | null) => {
          const updated: TaskInterface[] =
            tasks?.map(
              (sourceTask: TaskInterface): TaskInterface =>
                sourceTask._id === task._id ? task : sourceTask
            ) || [];
          return updated.filter(
            (sourceTask: TaskInterface): boolean => sourceTask.isImportant
          );
        });
      });

    this._taskHelperService.deletedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.importantTasks.update(
          (tasks: TaskInterface[] | null): TaskInterface[] => {
            return (
              tasks?.filter((sourceTask: TaskInterface) => {
                return sourceTask._id !== task._id;
              }) || []
            );
          }
        );
      });
  }

  protected onLoadMore(): void {
    this.currentPage.update((page: number): number => page + 1);
    this._updateVisibleTasks(
      this.searchQuery().trim()
        ? this.importantTasks().filter((task: TaskInterface): boolean =>
            task.name
              .toLowerCase()
              .includes(this.searchQuery().trim().toLowerCase())
          )
        : this.importantTasks()
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
