import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PageLayoutComponent } from '@pages/tasks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, PageLayoutComponent],
})
export class App {}
