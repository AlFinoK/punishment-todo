import { LucideAngularModule } from 'lucide-angular';
import {
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';

import {
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import {
  ButtonComponent,
  BadgeComponent,
  InputComponent,
} from '@shared/components';

import { AlertService } from '@shared/components/alert/core';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [
    ButtonComponent,
    LucideAngularModule,
    BadgeComponent,
    TaskFormComponent,
    InputComponent,
  ],
})
export class TaskCardComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public task: InputSignal<TaskInterface | null> = input<TaskInterface | null>(
    null
  );

  public isOpenDrawer: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  protected onDeleteTask(id: string | undefined): void {
    if (!id) return;

    event?.stopPropagation();
    this._taskService.deleteTaskById(id).subscribe((): void => {
      this._alertService.open('The task successfully deleted', {
        variant: 'success',
      }),
        (): void => {
          this._alertService.open('Failed to delete task', {
            variant: 'error',
          });
        };
    });
  }
}
