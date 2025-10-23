import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { ButtonSizeType, ButtonVariantType } from './core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public variant: InputSignal<ButtonVariantType> =
    input<ButtonVariantType>('primary');
  public size: InputSignal<ButtonSizeType> = input<ButtonSizeType>('md');
  public isLoading: InputSignal<boolean> = input<boolean>(false);
  public disabled: InputSignal<boolean> = input<boolean>(false);
  public type: InputSignal<string> = input<string>('button'); // в buttonRole
  public buttonClick: OutputEmitterRef<void> = output<void>();

  onButtonClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }

  constructor() {}
}
