import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import { AlertService } from '@shared/components/alert/core';

import { SearchFilterComponent, TasksListComponent } from '../common';
import { PaginationComponent } from '../common/pagination/pagination.component';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrl: './deleted-tasks.component.scss',
  imports: [SearchFilterComponent, TasksListComponent, PaginationComponent],
})
export class DeletedTasksComponent implements OnInit {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected deletedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected displayedTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);
  protected currentPage: WritableSignal<number> = signal<number>(1);
  protected tasksPerPage: number = 1;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          const filteredTasks: TaskInterface[] = tasks.filter(
            (task: TaskInterface) => task.status === this.taskStatusEnum.DELETED
          );

          this.deletedTasks.set(filteredTasks);
          this.displayedTasks.set(filteredTasks.slice(0, this.tasksPerPage));

          this.isLoadingTasks.set(false);
          this._alertService.open('Tasks successfully loaded', {
            variant: 'success',
          });
        },
        (): void => {
          this.isLoadingTasks.set(false);
          this._alertService.open('Failed to load tasks', { variant: 'error' });
        }
      );
  }

  protected onLoadMore(): void {
    const current = this.displayedTasks();
    const allTasks = this.deletedTasks();

    if (allTasks && current) {
      const nextPage: number = this.currentPage() + 1;
      const newTasks: TaskInterface[] = allTasks.slice(
        nextPage * this.tasksPerPage,
        (nextPage + 1) * this.tasksPerPage
      );

      this.displayedTasks.set([...current, ...newTasks]);
      this.currentPage.set(nextPage);
    }
  }

  ngOnInit(): void {
    this._getAllTasks();
  }
}
