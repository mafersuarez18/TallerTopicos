import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * @class UpdateTaskInput
 * @description GraphQL InputType for updating an existing task.
 * Supports partial updates: status, tags, assigned user, and descriptive fields
 * can all be changed independently.
 */
@InputType()
export class UpdateTaskInput {
  /**
   * Unique identifier of the task to be updated.
   */
  @Field(() => ID)
  id: string;

  /**
   * New title for the task (optional).
   */
  @Field({ nullable: true })
  title?: string;

  /**
   * New description for the task (optional).
   */
  @Field({ nullable: true })
  description?: string;

  /**
   * New lifecycle status for the task (optional).
   */
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  /**
   * Replacement array of tags for the task (optional).
   * Replaces the entire tags array, not appends to it.
   */
  @Field(() => [String], { nullable: true })
  tags?: string[];

  /**
   * ID of the new user to assign this task to (optional).
   */
  @Field(() => ID, { nullable: true })
  assignedUserId?: string;

  /**
   * ID of the new project to move this task to (optional).
   */
  @Field(() => ID, { nullable: true })
  projectId?: string;
}
