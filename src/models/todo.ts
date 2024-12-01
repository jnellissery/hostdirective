import { Identifiable } from './identifiable';

export type Todo = Identifiable & {
  title: string;
  completed: boolean;
};
