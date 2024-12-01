import { Directive, computed, signal } from '@angular/core';
import { ID, Identifiable } from '../models';

@Directive({
  selector: '[adk-list]',
  exportAs: 'adkList',
  standalone: true,
})
export class AdkList<T extends Identifiable> {
  #items = signal<Record<ID, T>>({});
  readonly items = computed(() => Object.values(this.#items()));

  /**
   * Get an item by id
   * @param id
   */
  get(id: ID): T | undefined {
    return this.#items()[id];
  }

  /**
   * Add new items to the list
   * @param newItems
   */
  add(...newItems: T[]): void {
    this.#items.update((items) =>
      newItems.reduce(
        (accumulator, item) => ({ ...accumulator, [item.id]: item }),
        items
      )
    );
  }

  /**
   * Update an item in the list
   * @param item
   */
  update(item: T): void {
    this.#items.update((items) => ({ ...items, [item.id]: item }));
  }

  /**
   * Remove an item from the list
   * @param item
   */
  remove(item: T): void {
    this.#items.update((items) => {
      const { [item.id]: _, ...rest } = items;
      return rest;
    });
  }

  /**
   * Clear all items from the list
   */
  clear(): void {
    this.#items.set({});
  }
}
