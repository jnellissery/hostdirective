import { Component } from '@angular/core';
import { AdkList } from './list';
import { TestBed } from '@angular/core/testing';
import { Todo } from '../models';

@Component({
  standalone: true,
  selector: 'adk-host',
  template: ``,
  hostDirectives: [AdkList],
})
class HostComponent {}

describe('AdkList', () => {
  let list: AdkList<Todo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    list = fixture.debugElement.injector.get(AdkList);
  });

  it('should add items', () => {
    list.add({ id: 1, title: 'Todo 1', completed: false });
    list.add({ id: 2, title: 'Todo 2', completed: false });
    expect(list.items()).toEqual([
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false },
    ]);
  });

  it('should update items', () => {
    list.add({ id: 1, title: 'Todo 1', completed: false });
    list.update({ id: 1, title: 'Todo 1', completed: true });
    expect(list.get(1)).toEqual({ id: 1, title: 'Todo 1', completed: true });
  });

  it('should remove items', () => {
    list.add({ id: 1, title: 'Todo 1', completed: false });
    list.add({ id: 2, title: 'Todo 2', completed: false });
    list.remove({ id: 1, title: 'Todo 1', completed: false });
    expect(list.items()).toEqual([
      { id: 2, title: 'Todo 2', completed: false },
    ]);
  });

  it('should clear items', () => {
    list.add({ id: 1, title: 'Todo 1', completed: false });
    list.add({ id: 2, title: 'Todo 2', completed: false });
    list.clear();
    expect(list.items()).toEqual([]);
  });
});
