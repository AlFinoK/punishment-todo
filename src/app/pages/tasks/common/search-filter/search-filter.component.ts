import {
  Component,
  ChangeDetectionStrategy,
  output,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent, ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
  imports: [LucideAngularModule, InputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {
  public query = signal<string>('');
  public searchChange: OutputEmitterRef<string> = output<string>();

  protected onQueryInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value;
    this.query.set(value);
    this.searchChange.emit(value);
  }

  protected onClear(): void {
    this.query.set('');
    this.searchChange.emit('');
  }
}
