import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import {
  ButtonComponent,
  TagComponent,
  LinkComponent,
} from '@shared/components';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [ButtonComponent, LucideAngularModule, TagComponent, LinkComponent],
})
export class NavbarComponent {}
