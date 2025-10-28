import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TaskService } from '@modules/task-module';
import { ButtonComponent, InputComponent } from '@shared/components';
import { AlertService } from '@shared/components/alert/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule, IDatePickerConfig } from 'ng2-date-picker';
import moment from 'moment';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  imports: [
    LucideAngularModule,
    ButtonComponent,
    InputComponent,
    DpDatePickerModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  public formSubmitted = output<void>();

  public taskName = signal('');
  public taskDate = signal('');
  public taskDescription = signal('');
  public isLoadingSubmit = signal(false);

  public taskDateModel = moment();

  public datePickerConfig: IDatePickerConfig = {
    format: 'YYYY-MM-DD',
    showGoToCurrent: true,
    firstDayOfWeek: 'mo',
  };

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  protected onDateChange(date: any): void {
    this.taskDate.set(moment(date).format('YYYY-MM-DD'));
  }

  protected onSubmit(): void {
    if (!this.taskName() || !this.taskDate() || !this.taskDescription()) {
      this._alertService.open('Пожалуйста, заполните все поля', {
        variant: 'warning',
      });
      return;
    }

    const payload = {
      name: this.taskName(),
      date: this.taskDate(),
      description: this.taskDescription(),
    };

    this.isLoadingSubmit.set(true);

    this._taskService.createTask(payload).subscribe(
      (): void => {
        this.isLoadingSubmit.set(false);
        this.taskName.set('');
        this.taskDate.set('');
        this.taskDescription.set('');
        this._alertService.open('Задача успешно добавлена!', {
          variant: 'success',
        });

        this.formSubmitted.emit();
      },
      (error: HttpErrorResponse): void => {
        console.error(error);
        this.isLoadingSubmit.set(false);
        this._alertService.open('Ошибка при добавлении задачи', {
          variant: 'error',
        });
      }
    );
  }
}
