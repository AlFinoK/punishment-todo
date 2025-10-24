import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { PortalModule } from '@angular/cdk/portal';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  imports: [PortalModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  public isOpen: InputSignal<boolean> = input<boolean>(true);

  public onDrawerToggle: OutputEmitterRef<boolean> = output<boolean>();

  constructor() {}

  protected toggleDrawer(): void {
    this.onDrawerToggle.emit(false);
  }
}
