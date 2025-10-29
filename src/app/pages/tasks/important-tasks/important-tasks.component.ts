import { Component, signal, WritableSignal } from '@angular/core';

import {
  SearchFilterComponent,
  PageTitleComponent,
  TasksListComponent,
} from '../common';
import { TaskInterface, TaskService } from '@modules/task-module';
import { TaskHelperService } from '@modules/task-module/services/task-helper.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '@shared/components/alert/core';

@Component({
  selector: 'app-important-tasks',
  templateUrl: './important-tasks.component.html',
  styleUrl: './important-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent, TasksListComponent],
})
export class ImportantTasksComponent {
  public importantTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);

  private _destroy$: Subject<void> = new Subject<void>();
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _listenImportantTasks(): void {
    this._taskHelperService.importantTasks$
      .pipe(takeUntil(this._destroy$))
      .subscribe((tasks: TaskInterface[]): void => {
        this.importantTasks.set(tasks);
      });
  }

  private _getImportantTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          const filteredTasks: TaskInterface[] = tasks.filter(
            (task: TaskInterface): boolean => task.isImportant
          );

          this.importantTasks.set(filteredTasks);
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
    this._listenImportantTasks();
    this._getImportantTasks();
  }
}
