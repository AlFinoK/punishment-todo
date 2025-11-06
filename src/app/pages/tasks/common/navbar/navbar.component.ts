import { LucideAngularModule } from 'lucide-angular';
import { Component, signal, WritableSignal } from '@angular/core';

import {
  ButtonComponent,
  TagComponent,
  LinkComponent,
  DrawerComponent,
} from '@shared/components';
import {
  TaskHelperService,
  TaskTagsInterface,
  TaskTagValueEnum,
} from '@modules/task-module';
import { tags } from '@shared/data';

import { TaskFormComponent } from '../task-form';
import { navbarLinks } from '@shared/data/navbarLinks';
import { NavbarLinksInterface } from '@shared/interfaces';

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
  protected readonly tags: TaskTagsInterface[] = tags;
  protected readonly navbarLinks: NavbarLinksInterface[] = navbarLinks;
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;

  public isOpenDrawer: WritableSignal<boolean> = signal<boolean>(false);

  constructor(private _taskHelperService: TaskHelperService) {}

  protected openDrawer(): void {
    this.isOpenDrawer.set(true);
  }

  protected closeDrawer(): void {
    this.isOpenDrawer.set(false);
  }

  protected filterTasksByTag(value: TaskTagsInterface): void {
    this._taskHelperService.filterTasksByTag(value);
  }
}
