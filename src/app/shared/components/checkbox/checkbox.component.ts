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
      useExisting: forwardRef(
        (): typeof CheckboxComponent => CheckboxComponent
      ),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  public labelPosition: InputSignal<CheckboxLabelPositionType> =
    input<CheckboxLabelPositionType>('left');
  public label: InputSignal<string> = input<string>('');

  protected value: WritableSignal<string> = signal('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked ? 'true' : '');
    this.onChange(this.value());
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
