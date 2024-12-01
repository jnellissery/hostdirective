import { Directive, inject } from '@angular/core';
import {
  AdkList,
  AdkSelection,
  AdkHttpClient,
  AdkPagination,
} from '../directives';
import { ID, Page, Todo } from '../models';

@Directive({
  selector: '[adk-todos]',
  exportAs: 'adkTodos',
  standalone: true,
  /**
   * Important! Angular Directive composition API in action!
   */
  hostDirectives: [
    { directive: AdkHttpClient, inputs: ['adkUrl', 'adkPage', 'adkLimit'] },
    AdkList,
    AdkSelection,
    AdkPagination,
  ],
})
export class AdkTodos<T extends Todo> {
  #httpClient = inject(AdkHttpClient, { self: true });
  #list = inject<AdkList<T>>(AdkList, { self: true });
  #selection = inject(AdkSelection, { self: true });
  #pagination = inject(AdkPagination, { self: true });

  /**
   * The list of todos
   */
  readonly items = this.#list.items;

  /**
   * Check if we are on the first page
   */
  readonly first = this.#pagination.first;

  /**
   * Check if we are on the last page
   */
  readonly last = this.#pagination.last;

  /**
   * The total number of the selected todos
   */
  readonly selectedCount = this.#selection.count;

  /**
   * The total number of todos
   */
  readonly total = this.#pagination.total.asReadonly();

  /**
   * Fetch the todos from the server
   */
  async fetch(): Promise<void> {
    const page: Page = {
      page: this.#pagination.page(),
      limit: this.#pagination.limit(),
    };
    const { total, items } = await this.#httpClient.get<T>(page);
    this.#pagination.total.set(total);
    this.#list.add(...items);
  }

  /**
   * Go to the next page
   */
  async next(): Promise<void> {
    this.#pagination.next();
    this.#list.clear();
    await this.fetch();
  }

  /**
   * Go to the previous page
   */
  async previous(): Promise<void> {
    this.#pagination.previous();
    this.#list.clear();
    await this.fetch();
  }

  /**
   * Select todos by their ids
   * @param ids
   */
  select(...ids: ID[]): void {
    this.#selection.select(...ids);
  }

  /**
   * Select all todos
   */
  selectAll(): void {
    this.#selection.select(...this.items().map((todo) => todo.id));
  }

  /**
   * Deselect all todos
   */
  reset(): void {
    this.#selection.clear();
  }

  /**
   * Check if a todo is selected
   * @param id
   */
  selected(id: ID): boolean {
    return this.#selection.selected(id);
  }

  /**
   * Deselect a todo by its id
   * @param id
   */
  deselect(id: ID): void {
    this.#selection.deselect(id);
  }
}
