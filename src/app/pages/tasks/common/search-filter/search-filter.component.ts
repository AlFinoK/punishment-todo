import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent, ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
  imports: [LucideAngularModule, InputComponent, ButtonComponent],
})
export class SearchFilterComponent {}
