import { Component } from '@angular/core';

import { SearchFilterComponent, PageTitleComponent } from '../common';

@Component({
  selector: 'app-finished-tasks',
  templateUrl: './finished-tasks.component.html',
  styleUrl: './finished-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent],
})
export class FinishedTasksComponent {}
