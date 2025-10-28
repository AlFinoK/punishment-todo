import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  public label: InputSignal<string> = input<string>('');
  public placeholder: InputSignal<string> = input<string>('');
  public variant: InputSignal<string> = input<string>('text');
  public value: InputSignal<string> = input<string>('');

  public valueChange: OutputEmitterRef<string> = output<string>();

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
