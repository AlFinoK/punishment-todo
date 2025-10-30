import {
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertVariantType } from './core/types';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  public messageInput: InputSignal<string> = input<string>('');
  public variantInput: InputSignal<AlertVariantType> =
    input<AlertVariantType>('success');

  protected message: WritableSignal<string> = signal('');
  protected variant: WritableSignal<AlertVariantType> = signal('success');
  protected isVisible: WritableSignal<boolean> = signal(false);

  show(message: string, variant: AlertVariantType, duration = 5000): void {
    this.message.set(message);
    this.variant.set(variant);
    this.isVisible.set(true);

    setTimeout((): void => this.isVisible.set(false), duration);
  }
}
