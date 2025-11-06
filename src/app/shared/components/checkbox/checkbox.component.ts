import {
  signal,
  WritableSignal,
  input,
  ChangeDetectionStrategy,
  InputSignal,
  Component,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxLabelPositionType } from './core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  public labelPosition: InputSignal<CheckboxLabelPositionType> =
    input<CheckboxLabelPositionType>('left');
  public label: InputSignal<string> = input<string>('');

  protected value: WritableSignal<boolean> = signal(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: boolean): void {
    this.value.set(!!value);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
    this.onChange(this.value());
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
