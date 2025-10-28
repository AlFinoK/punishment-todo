import { LucideAngularModule } from 'lucide-angular';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  ButtonComponent,
  TagComponent,
  LinkComponent,
  TagInterface,
} from '@shared/components';

import { TaskDrawerComponent } from '../task-drawer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [
    ButtonComponent,
    LucideAngularModule,
    TagComponent,
    LinkComponent,
    TaskDrawerComponent,
  ],
})
export class NavbarComponent {
  protected readonly tags: TagInterface[] = [
    {
      value: 'productivity',
      color: 'purple',
    },
    {
      value: 'education',
      color: 'green',
    },
    {
      value: 'health',
      color: 'orange',
    },
    {
      value: 'urgently',
      color: 'red',
    },
  ];

  public isOpenDrawer: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {}

  protected onOpenDrawer(event: boolean): void {
    this.isOpenDrawer.set(event);
  }
}
