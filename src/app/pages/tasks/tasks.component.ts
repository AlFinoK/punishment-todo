import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent, SearchFilterComponent } from '@shared/components';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  imports: [RouterOutlet, SearchFilterComponent, NavbarComponent],
})
export class TasksComponent {}
