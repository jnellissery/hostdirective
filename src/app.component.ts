import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './components';

const components = [TodosComponent];

@Component({
  selector: 'adk-root',
  standalone: true,
  template: `
    <adk-todos
      adkUrl="https://jsonplaceholder.typicode.com/todos"
      [adkPage]="4"
      [adkLimit]=20
    ></adk-todos>
  `,
  imports: [CommonModule, RouterOutlet, ...components],
})
export class AppComponent {}
