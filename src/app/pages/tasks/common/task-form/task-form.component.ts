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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { DpDatePickerModule, IDatePickerConfig } from 'ng2-date-picker';

import {
  ButtonComponent,
  InputComponent,
  TextareaComponent,
} from '@shared/components';
import {
  CreateTaskInterface,
  TaskService,
  TaskTagsInterface,
  TaskTagValueEnum,
} from '@modules/task-module';
import { tags } from '@shared/data';
import { AlertService } from '@shared/components/alert/core';
import { CheckboxComponent } from '@shared/components/checkbox';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  imports: [
    LucideAngularModule,
    ButtonComponent,
    DpDatePickerModule,
    ReactiveFormsModule,
    TitleCasePipe,
    InputComponent,
    TextareaComponent,
    CheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;
  protected readonly tags: TaskTagsInterface[] = tags;

  public formSubmitted: OutputEmitterRef<void> = output<void>();

  private _destroy$: Subject<void> = new Subject<void>();

  protected isLoadingSubmit: WritableSignal<boolean> = signal(false);
  protected currentDate: string = new Date().toISOString().split('T')[0];
  protected form: FormGroup | null = null;

  protected datePickerConfig: IDatePickerConfig = {
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'mo',
    min: this.currentDate,
    showNearMonthDays: false,
  };

  protected get getButtonTextByAction() {
    return this.isLoadingSubmit() ? 'Saving...' : 'save';
  }

  get formTags(): FormArray {
    return this.form?.get('tags') as FormArray;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  private _initForm(): void {
    this.form = this._formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      isImportant: [false],
      endTime: [null, Validators.required],
      endDate: [this.currentDate, Validators.required],
      tags: this._formBuilder.array(
        this.tags.map((): boolean => false),
        Validators.required
      ),
    });
  }

  protected onSubmit(taskId?: string): void {
    if (taskId) this.onSubmitEditTask(taskId);
    else this.onSubmitCreateTask();
  }

  protected onSubmitCreateTask(): void {
    if (!this.form) return;

    const formValue: CreateTaskInterface = this.form.value;

    const selectedTags: string[] = this.formTags.controls
      .map((control, idx: number): string | null =>
        control.value ? this.tags[idx].value : null
      )
      .filter((tag: string | null) => tag != null);

    formValue.tags = selectedTags;

    this.isLoadingSubmit.set(true);

    this._taskService
      .createTask(formValue)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (): void => {
          this.isLoadingSubmit.set(false);
          this._alertService
            .open('The task was successfully added!', { variant: 'success' })
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

  protected onSubmitEditTask(taskId: string): void {
    const formValue: CreateTaskInterface = this.form?.value;

    this.isLoadingSubmit.set(true);

    this._taskService
      .editTask(formValue, taskId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (): void => {
          this.isLoadingSubmit.set(false);
          this._alertService
            .open('The task was successfully edited!', { variant: 'success' })
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
    this.formTags;
  }
}
