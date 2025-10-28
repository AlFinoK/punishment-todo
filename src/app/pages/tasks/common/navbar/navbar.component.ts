import { LucideAngularModule } from 'lucide-angular';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  ButtonComponent,
  TagComponent,
  LinkComponent,
  TagInterface,
  DrawerComponent,
} from '@shared/components';
import { TaskFormComponent } from '../task-form';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [
    ButtonComponent,
    LucideAngularModule,
    TagComponent,
    LinkComponent,
    DrawerComponent,
    TaskFormComponent,
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

  protected openDrawer(): void {
    this.isOpenDrawer.set(true);
  }

  protected closeDrawer(): void {
    this.isOpenDrawer.set(false);
  }
}
