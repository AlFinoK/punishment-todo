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

import { InputVariantType } from './core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef((): typeof InputComponent => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  public label: InputSignal<string> = input('');
  public placeholder: InputSignal<string> = input('');
  public variant: InputSignal<InputVariantType> =
    input<InputVariantType>('text');

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
    this.value.set(target.value);
    this.onChange(this.value());
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
