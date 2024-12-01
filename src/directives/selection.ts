import { Directive, computed, signal } from '@angular/core';
import { ID } from '../models';

@Directive({
  selector: '[adk-selection]',
  exportAs: 'adkSelection',
  standalone: true,
})
export class AdkSelection {
  #items = signal<Record<ID, boolean>>({});
  count = computed(() => Object.values(this.#items()).filter(Boolean).length);

  /**
   * Select multiple items
   * @param ids
   */
  select(...ids: ID[]): void {
    this.#items.update((items) =>
      ids.reduce((accumulator, id) => ({ ...accumulator, [id]: true }), items)
    );
  }

  /**
   * Deselect an item
   * @param id
   */
  deselect(id: ID): void {
    this.#items.update((items) => {
      const { [id]: _, ...rest } = items;
      return rest;
    });
  }

  /**
   * Clear all selected items
   */
  clear(): void {
    this.#items.set({});
  }

  /**
   * Check if an item is selected
   * @param id
   */
  selected(id: ID): boolean {
    return this.#items()[id] ?? false;
  }
}
