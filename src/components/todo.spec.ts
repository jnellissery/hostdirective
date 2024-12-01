import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AdkTodos } from './todo';
import { Page, Todo } from '../models';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AdkHttpClient } from '../directives';

const TODO_DATA_MOCK: Todo[] = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    title: `Todo ${index + 1}`,
    completed: false,
  }));

const HTTP_CLIENT_MOCK = {
  async get(page?: Page): Promise<{ total: number; items: Todo[] }> {
    return {
      total: TODO_DATA_MOCK.length,
      items: TODO_DATA_MOCK.slice(0, 10),
    };
  },
};

@Component({
  standalone: true,
  selector: 'adk-host',
  template: ``,
  hostDirectives: [AdkTodos],
})
class HostComponent {}

describe('AdkTodos', () => {
  let todos: AdkTodos<Todo>;

  beforeEach(async () => {
    const module = TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [HostComponent],
    });
    await module.compileComponents();
    const fixture = module.createComponent(HostComponent);

    todos = fixture.debugElement.injector.get(AdkTodos);
    fixture.componentRef.setInput(
      'adkUrl',
      'https://jsonplaceholder.typicode.com/todos'
    );
  });

  it('should fetch todos', async () => {
    const promise = todos.fetch();

    const controller = TestBed.inject(HttpTestingController);
    controller
      .expectOne(
        'https://jsonplaceholder.typicode.com/todos?_page=1&_per_page=10'
      )
      .flush([{ id: 1, title: 'Todo 1', completed: false }], {
        headers: { 'X-Total-Count': '1' },
      });

    await promise;
    expect(todos.items()).toEqual([
      { id: 1, title: 'Todo 1', completed: false },
    ]);
    expect(todos.total()).toBe(1);
    controller.verify();
  });

  it('should go to the next page', async () => {
    const promise = todos.fetch();

    const controller = TestBed.inject(HttpTestingController);

    controller
      .expectOne(
        'https://jsonplaceholder.typicode.com/todos?_page=1&_per_page=10'
      )
      .flush(TODO_DATA_MOCK.slice(0, 10), {
        headers: { 'X-Total-Count': '20' },
      });

    await promise;
    expect(todos.total()).toEqual(20);

    todos.next();

    controller
      .expectOne(
        'https://jsonplaceholder.typicode.com/todos?_page=2&_per_page=10'
      )
      .flush(TODO_DATA_MOCK.slice(10), {
        headers: { 'X-Total-Count': '20' },
      });

    controller.verify();
  });
});

describe('AdkTodos — MOCK_HTTP_CLIENT', () => {
  let todos: AdkTodos<Todo>;

  beforeEach(async () => {
    const module = TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [HostComponent],
    });
    /**
     * Important! How we can override the directive with a mock implementation
     */
    module.overrideDirective(AdkHttpClient, {
      set: {
        providers: [{ provide: AdkHttpClient, useValue: HTTP_CLIENT_MOCK }],
      },
    });
    await module.compileComponents();

    const fixture = module.createComponent(HostComponent);

    todos = fixture.debugElement.injector.get(AdkTodos);
    fixture.componentRef.setInput(
      'adkUrl',
      'https://jsonplaceholder.typicode.com/todos'
    );
  });

  it('should fetch todos', async () => {
    await todos.fetch();
    expect(todos.items()).toEqual(TODO_DATA_MOCK.slice(0, 10));
    expect(todos.total()).toBe(20);
  });

  it('should select one item', async () => {
    await todos.fetch();
    const id = todos.items()[0].id;
    todos.select(id);

    expect(todos.selected(id)).toBe(true);
    expect(todos.selectedCount()).toBe(1);
  });

  it('should deselect one item', async () => {
    await todos.fetch();
    const id = todos.items()[0].id;
    todos.select(id);
    todos.deselect(id);

    expect(todos.selected(id)).toBe(false);
    expect(todos.selectedCount()).toBe(0);
  });
});
