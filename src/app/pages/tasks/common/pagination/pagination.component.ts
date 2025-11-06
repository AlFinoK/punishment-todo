import {
  Component,
  InputSignal,
  input,
  OutputEmitterRef,
  output,
} from '@angular/core';

import { ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  imports: [ButtonComponent],
})
export class PaginationComponent {
  public totalItems: InputSignal<number> = input<number>(0);
  public itemsPerPage: InputSignal<number> = input<number>(5);
  public currentPage: InputSignal<number> = input<number>(1);

  public loadMore: OutputEmitterRef<void> = output<void>();

  get hasMoreItems(): boolean {
    return this.totalItems() > this.currentPage() * this.itemsPerPage();
  }

  get nextPage(): number {
    return this.currentPage() + 1;
  }

  get qty(): number {
    return this.totalItems() - this.currentPage() * this.itemsPerPage();
  }

  onLoadMore(): void {
    if (this.hasMoreItems) {
      this.loadMore.emit();
    }
  }
}
