import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { ButtonRoleType, ButtonSizeType, ButtonVariantType } from './core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public variant: InputSignal<ButtonVariantType> =
    input<ButtonVariantType>('primary');
  public buttonRole: InputSignal<ButtonRoleType> =
    input<ButtonRoleType>('button');
  public size: InputSignal<ButtonSizeType> = input<ButtonSizeType>('md');
  public isLoading: InputSignal<boolean> = input<boolean>(false);
  public disabled: InputSignal<boolean> = input<boolean>(false);
  public buttonClick: OutputEmitterRef<void> = output<void>();

  protected onButtonClick(): void {
    if (this.disabled()) return;

    this.buttonClick.emit();
  }

  constructor() {}
}
