import { InputType, Field, ID } from '@nestjs/graphql';

/**
 * @class UpdateUserInput
 * @description GraphQL InputType for updating an existing user.
 * All fields except id are optional to allow partial updates.
 */
@InputType()
export class UpdateUserInput {
  /**
   * Unique identifier of the user to be updated.
   */
  @Field(() => ID)
  id: string;

  /**
   * New full name for the user (optional).
   */
  @Field({ nullable: true })
  name?: string;

  /**
   * New email address for the user (optional).
   */
  @Field({ nullable: true })
  email?: string;
}
