import {
  Component,
  ChangeDetectionStrategy,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
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
  public query: WritableSignal<string> = signal<string>('');
  public searchChange: OutputEmitterRef<string> = output<string>();

  protected onQueryInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.query.set(inputEl.value);
    this.searchChange.emit(inputEl.value);
  }

  protected onClear(): void {
    this.query.set('');
    this.searchChange.emit('');
  }
}
