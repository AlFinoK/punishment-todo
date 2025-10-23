import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import {
  ButtonComponent,
  ButtonSizeEnum,
  ButtonVariantEnum,
  TagColorEnum,
  TagComponent,
  TagTypeEnum,
} from '@shared/components';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [ButtonComponent, LucideAngularModule, TagComponent],
})
export class NavbarComponent {
  protected readonly tagColorEnum: typeof TagColorEnum = TagColorEnum;
  protected readonly tagTypeEnum: typeof TagTypeEnum = TagTypeEnum;
  protected readonly buttonVariantEnum: typeof ButtonVariantEnum =
    ButtonVariantEnum;
  protected readonly buttonSizeEnum: typeof ButtonSizeEnum = ButtonSizeEnum;
}
