import { registerEnumType } from '@nestjs/graphql';

/**
 * @enum TaskStatus
 * @description Represents the lifecycle states of a task in the system.
 * Tasks progress through these states as work advances.
 */
export enum TaskStatus {
  /** Task has been identified but not yet scheduled */
  BACKLOG = 'BACKLOG',
  /** Task is scheduled and ready to be started */
  TODO = 'TODO',
  /** Task is currently being worked on */
  IN_PROGRESS = 'IN_PROGRESS',
  /** Task has been completed */
  DONE = 'DONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'The possible lifecycle states of a task',
  valuesMap: {
    BACKLOG: { description: 'Task identified but not yet scheduled' },
    TODO: { description: 'Task scheduled and ready to start' },
    IN_PROGRESS: { description: 'Task currently being worked on' },
    DONE: { description: 'Task completed' },
  },
});
