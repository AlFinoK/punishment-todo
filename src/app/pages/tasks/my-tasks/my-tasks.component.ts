import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

import { TaskInterface, TaskService } from '@modules/task-module';

import {
  TasksListComponent,
  PageTitleComponent,
  SearchFilterComponent,
} from '../common';
import { AlertService } from '@shared/components/alert/core';
import { TaskHelperService } from '@modules/task-module/services/task-helper.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
  imports: [TasksListComponent, PageTitleComponent, SearchFilterComponent],
})
export class MyTasksComponent {
  protected tasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _listenAllTasks(): void {
    this._taskHelperService.tasks$
      .pipe(takeUntil(this._destroy$))
      .subscribe((tasks: TaskInterface[]): void => {
        this.tasks.set(tasks);
      });
  }

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.tasks.set(tasks);
          this.isLoadingTasks.set(false);

          this._alertService.open('Задачи успешно загружены', {
            variant: 'success',
          });
        },

        (): void => {
          this.isLoadingTasks.set(false);

          this._alertService.open('Не удалось загрузить задачи', {
            variant: 'error',
          });
        }
      );
  }

  ngOnInit(): void {
    this._listenAllTasks();
    this._getAllTasks();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
