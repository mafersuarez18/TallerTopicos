import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * @class CreateTaskInput
 * @description GraphQL InputType for creating a new task.
 * Contains all required fields to register a task in the system.
 */
@InputType()
export class CreateTaskInput {
  /**
   * Short, descriptive title for the task.
   */
  @Field()
  title: string;

  /**
   * Detailed description of what the task entails.
   */
  @Field()
  description: string;

  /**
   * Initial lifecycle status of the task. Defaults to BACKLOG if not provided.
   */
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  /**
   * Array of string tags to categorize the task.
   */
  @Field(() => [String], { nullable: true })
  tags?: string[];

  /**
   * ID of the user to assign this task to.
   */
  @Field(() => ID)
  assignedUserId: string;

  /**
   * ID of the project this task belongs to.
   */
  @Field(() => ID)
  projectId: string;
}
