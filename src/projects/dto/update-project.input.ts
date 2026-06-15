import { InputType, Field, ID } from '@nestjs/graphql';

/**
 * @class UpdateProjectInput
 * @description GraphQL InputType for updating an existing project.
 * All fields except id are optional to allow partial updates.
 */
@InputType()
export class UpdateProjectInput {
  /**
   * Unique identifier of the project to be updated.
   */
  @Field(() => ID)
  id: string;

  /**
   * New name for the project (optional).
   */
  @Field({ nullable: true })
  name?: string;

  /**
   * New description for the project (optional).
   */
  @Field({ nullable: true })
  description?: string;
}
