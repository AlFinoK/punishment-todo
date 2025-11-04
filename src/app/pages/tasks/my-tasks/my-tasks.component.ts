import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
  TaskTagsInterface,
} from '@modules/task-module';
import { AlertService } from '@shared/components/alert/core';

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
})
export class MyTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected tasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected displayedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
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
      .getAllTasks()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          const tags: TaskTagsInterface[] =
            this._taskHelperService.activeTags$.getValue();

          console.log(tags);

          const filteredTasks: TaskInterface[] = tasks.filter(
            (task: TaskInterface): boolean =>
              task.status !== this.taskStatusEnum.FINISHED &&
              task.status !== this.taskStatusEnum.DELETED
          );

          this.displayedTasks.set(filteredTasks.slice(0, this.tasksPerPage));
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

  protected onLoadMore(): void {
    const displayedTasks: TaskInterface[] | null = this.displayedTasks();
    const tasks: TaskInterface[] | null = this.tasks();

    if (tasks && displayedTasks) {
      const nextPage: number = this.currentPage() + 1;
      const newTasks: TaskInterface[] = tasks.slice(
        nextPage * this.tasksPerPage,
        (nextPage + 1) * this.tasksPerPage
      );

      this.displayedTasks.set([...displayedTasks, ...newTasks]);
      this.currentPage.set(nextPage);
    }
  }

  ngOnInit(): void {
    this._getAllTasks();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
