import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LinkSizeType } from './core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  public size: InputSignal<LinkSizeType> = input<LinkSizeType>('md');
  public routerLink: InputSignal<string> = input<string>('');

  constructor() {}
}
