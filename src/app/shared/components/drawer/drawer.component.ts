import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  public isOpen: InputSignal<boolean> = input<boolean>(false);
  public toggleDrawer: OutputEmitterRef<boolean> = output<boolean>();

  constructor() {}

  protected onToggleDrawer(): void {
    this.toggleDrawer.emit(false);
  }
}
