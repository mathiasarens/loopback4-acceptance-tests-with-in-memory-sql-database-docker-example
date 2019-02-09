import {Entity, model, property} from '@loopback/repository';

@model()
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isComplete?: boolean;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}
