import { Component, signal, WritableSignal } from '@angular/core';

import {
  SearchFilterComponent,
  PageTitleComponent,
  TasksListComponent,
} from '../common';
import { TaskInterface, TaskService } from '@modules/task-module';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '@shared/components/alert/core';

@Component({
  selector: 'app-important-tasks',
  templateUrl: './important-tasks.component.html',
  styleUrl: './important-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent, TasksListComponent],
})
export class ImportantTasksComponent {
  protected importantTasks: WritableSignal<TaskInterface[] | null> = signal<
    TaskInterface[] | null
  >(null);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

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
    this._getImportantTasks();
  }
}
