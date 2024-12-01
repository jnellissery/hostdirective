import { Directive, computed, signal } from '@angular/core';

@Directive({
  selector: '[adk-pagination]',
  exportAs: 'adkPagination',
  standalone: true,
})
export class AdkPagination {
  #page = signal(1);
  readonly page = computed(() => this.#page());
  limit = signal(20);
  readonly total = signal(0);

  /**
   * Check if the current page is the first
   */
  first = computed(() => this.#page() === 1);

  /**
   * Check if the current page is the last
   */
  last = computed(() => this.#page() * this.limit() >= this.total());

  /**
   * Go to the next page
   */
  next(): void {
    if (this.last()) {
      throw new Error('You are already on the last page');
    }
    this.#page.update((page) => page + 1);
  }

  /**
   * Go to the previous page
   */
  previous(): void {
    if (this.first()) {
      throw new Error('You are already on the first page');
    }
    this.#page.update((page) => page - 1);
  }
}
