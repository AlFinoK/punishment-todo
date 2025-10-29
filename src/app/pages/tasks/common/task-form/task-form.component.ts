import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  OutputEmitterRef,
  WritableSignal,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { DpDatePickerModule, IDatePickerConfig } from 'ng2-date-picker';

import { AlertService } from '@shared/components/alert/core';
import { ButtonComponent, InputComponent } from '@shared/components';
import { CreateTaskInterface, TaskService } from '@modules/task-module';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  imports: [
    LucideAngularModule,
    ButtonComponent,
    InputComponent,
    DpDatePickerModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  public formSubmitted: OutputEmitterRef<void> = output<void>();

  private _destroy$: Subject<void> = new Subject<void>();

  protected isLoadingSubmit: WritableSignal<boolean> = signal(false);

  protected form: FormGroup | null = null;

  protected datePickerConfig: IDatePickerConfig = {
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'mo',
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  private _initForm(): void {
    this.form = this._formBuilder.group({
      name: [null, Validators.required],
      endDate: [null, Validators.required],
      description: [null],
    });
  }

  protected onSubmit(): void {
    const formValue: CreateTaskInterface = this.form?.value;
    console.log(formValue);

    this.isLoadingSubmit.set(true);

    this._taskService
      .createTask(formValue)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (): void => {
          this.isLoadingSubmit.set(false);
          this._alertService
            .open('The task was successfully added!', {
              variant: 'success',
            })
            .subscribe();

          this.formSubmitted.emit();
        },
        (error: HttpErrorResponse): void => {
          const errorMsg: string = error.error.message;
          this._alertService.open(errorMsg, { variant: 'error' }).subscribe();
          this.isLoadingSubmit.set(false);
        }
      );
  }

  ngOnInit(): void {
    this._initForm();
  }
}
