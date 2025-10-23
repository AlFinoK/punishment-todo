import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { ButtonSizeEnum, ButtonTypeEnum, ButtonVariantEnum } from './core/enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  protected readonly buttonSizeEnum: typeof ButtonSizeEnum = ButtonSizeEnum;
  protected readonly buttonTypeEnum: typeof ButtonTypeEnum = ButtonTypeEnum;
  protected readonly buttonVariantEnum: typeof ButtonVariantEnum =
    ButtonVariantEnum;

  public variant: InputSignal<string> = input<string>(
    this.buttonVariantEnum.PRIMARY
  );
  public size: InputSignal<string> = input<string>(this.buttonSizeEnum.MD);
  public isLoading: InputSignal<boolean> = input<boolean>(false);
  public disabled: InputSignal<boolean> = input<boolean>(false);
  public type: InputSignal<string> = input<string>(this.buttonTypeEnum.BUTTON);
  public buttonClick: OutputEmitterRef<void> = output<void>();

  onButtonClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }

  constructor() {}
}
