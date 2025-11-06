import { Subject, takeUntil } from 'rxjs';
import { Component, signal, WritableSignal } from '@angular/core';

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
})
export class CompletedTasksComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  protected completedTasks: WritableSignal<TaskInterface[]> = signal<
    TaskInterface[]
  >([]);
  protected isLoadingTasks: WritableSignal<boolean> = signal<boolean>(false);

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _listenTasksStatuses(): void {
    this._taskHelperService.createdTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.completedTasks.update(
          (tasks: TaskInterface[] | null): TaskInterface[] => [
            task,
            ...(tasks || []),
          ]
        );
        const filteredTasks: TaskInterface[] = this.completedTasks().filter(
          (task: TaskInterface): boolean => task.isImportant
        );

        this.completedTasks.set(filteredTasks);
      });

    this._taskHelperService.updatedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.completedTasks.update(
          (tasks: TaskInterface[] | null): TaskInterface[] => {
            return (
              tasks?.map((sourceTask: TaskInterface) =>
                sourceTask._id === task._id ? task : sourceTask
              ) || []
            );
          }
        );
      });

    this._taskHelperService.deletedTask$
      .pipe(takeUntil(this._destroy$))
      .subscribe((task: TaskInterface): void => {
        this.completedTasks.update(
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

  private _getAllTasks(): void {
    this.isLoadingTasks.set(true);

    this._taskService
      .getAllTasks(this.taskStatusEnum.COMPLETED, false)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (tasks: TaskInterface[]): void => {
          this.completedTasks.set(tasks);
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

  ngOnInit(): void {
    this._getAllTasks();
    this._listenTasksStatuses();
  }
}
