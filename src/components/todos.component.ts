import { Component, OnInit, inject } from '@angular/core';
import { AdkTodos } from './todo';

@Component({
  standalone: true,
  selector: 'adk-todos',
  hostDirectives: [AdkTodos],
  template: `
    <header>
      <button (click)="todos.reset()">Reset All</button>
    </header>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Completed</th>
          <th>Selection ({{ todos.selectedCount() }})</th>
        </tr>
      </thead>
      <tbody>
        @for (item of todos.items(); track (item.id)) {
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.completed }}</td>
          <td>
            <button (click)="todos.selected(item.id)
                  ? todos.deselect(item.id)
                  : todos.select(item.id)">
              {{ todos.selected(item.id) ? 'Deselect' : 'Select' }}
            </button>
          </td>
        </tr>
        }
      </tbody>
    </table>

    <footer>
      <button [disabled]="todos.first()" (click)="todos.previous()">
        Previous
      </button>
      &nbsp;
      <button [disabled]="todos.last()" (click)="todos.next()">Next</button>
    </footer>
  `,
  styles: [
    `
      header,
      footer {
        padding: 1rem 0;
      }

      th,
      td {
        border: 1px solid black;
        padding: 0.25rem 0.5rem;
      }
    `,
  ],
})
export class TodosComponent implements OnInit {
  todos = inject(AdkTodos, { self: true });

  ngOnInit(): void {
    this.todos.fetch();
  }
}
