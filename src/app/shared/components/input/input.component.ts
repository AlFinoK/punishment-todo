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

import { InputRoleType, InputLabelPositionType } from './core';
import { InputSizeType } from './core/types/input-size.type';

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
  public labelPosition: InputSignal<InputLabelPositionType> =
    input<InputLabelPositionType>('left');
  public label: InputSignal<string> = input<string>('');
  public placeholder: InputSignal<string> = input<string>('');
  public inputRole: InputSignal<InputRoleType> = input<InputRoleType>('text');
  public size: InputSignal<InputSizeType> = input<InputSizeType>('md');

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
