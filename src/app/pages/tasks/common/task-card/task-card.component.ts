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
  DrawerComponent,
} from '@shared/components';

import { AlertService } from '@shared/components/alert/core';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ModalComponent } from '@shared/components/modal';
import { CheckboxComponent } from '@shared/components/checkbox';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [
    ButtonComponent,
    LucideAngularModule,
    BadgeComponent,
    TaskFormComponent,
    ModalComponent,
    CheckboxComponent,
    DrawerComponent,
  ],
})
export class TaskCardComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public task: InputSignal<TaskInterface | null> = input<TaskInterface | null>(
    null
  );

  public isOpenDrawer: WritableSignal<boolean> = signal<boolean>(false);
  public isOpenModal: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  protected openModal(): void {
    this.isOpenModal.set(true);
  }

  protected closeModal(): void {
    this.isOpenModal.set(false);
  }

  protected openDrawer(): void {
    this.isOpenDrawer.set(true);
  }

  protected closeDrawer(): void {
    this.isOpenDrawer.set(false);
  }

  protected onDeleteTask(id: string | undefined): void {
    if (!id) return;

    event?.stopPropagation();
    this._taskService.deleteTaskById(id).subscribe((): void => {
      this.closeModal();
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
