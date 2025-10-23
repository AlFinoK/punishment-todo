import { Component, input, InputSignal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
  imports: [LucideAngularModule],
})
export class PageTitleComponent {
  public text: InputSignal<string> = input<string>('');

  constructor() {}
}
