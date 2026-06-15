import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from './enums/task-status.enum';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

/**
 * @class Task
 * @description GraphQL ObjectType representing a task in the project management system.
 * A task belongs to a project and can be assigned to a user, with lifecycle states
 * and organizational tags.
 */
@ObjectType()
export class Task {
  /**
   * Unique identifier for the task (UUID v4).
   */
  @Field(() => ID)
  id: string;

  /**
   * Short, descriptive title of the task.
   */
  @Field()
  title: string;

  /**
   * Detailed description explaining what the task entails.
   */
  @Field()
  description: string;

  /**
   * Current lifecycle state of the task.
   * @see TaskStatus
   */
  @Field(() => TaskStatus)
  status: TaskStatus;

  /**
   * Dynamic array of string tags for categorizing and filtering tasks.
   */
  @Field(() => [String])
  tags: string[];

  /**
   * ISO 8601 timestamp of when the task was created.
   */
  @Field()
  createdAt: string;

  /**
   * The user responsible for completing this task.
   */
  @Field(() => User)
  assignedUser: User;

  /**
   * The project this task belongs to.
   */
  @Field(() => Project)
  project: Project;
}
