import { Component } from '@angular/core';

import { SearchFilterComponent, PageTitleComponent } from '../common';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrl: './deleted-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent],
})
export class DeletedTasksComponent {}
