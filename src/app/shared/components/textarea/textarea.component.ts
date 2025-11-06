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

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        (): typeof TextareaComponent => TextareaComponent
      ),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  public label: InputSignal<string> = input<string>('');
  public placeholder: InputSignal<string> = input<string>('');
  public maxLength: InputSignal<number> = input<number>(200);
  protected value: WritableSignal<string> = signal('');

  private onChange: (value: string) => void = (): void => {};
  private onTouched: () => void = (): void => {};

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
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
    this.onChange(this.value());
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
