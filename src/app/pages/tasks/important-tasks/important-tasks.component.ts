import { Component } from '@angular/core';

import { SearchFilterComponent, PageTitleComponent } from '../common';

@Component({
  selector: 'app-important-tasks',
  templateUrl: './important-tasks.component.html',
  styleUrl: './important-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent],
})
export class ImportantTasksComponent {}
