import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './common';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  imports: [RouterOutlet, NavbarComponent],
})
export class TasksComponent {
  constructor() {}
}
