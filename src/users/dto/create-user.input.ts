import { InputType, Field } from '@nestjs/graphql';

/**
 * @class CreateUserInput
 * @description GraphQL InputType for creating a new user.
 * Contains all required fields to register a user in the system.
 */
@InputType()
export class CreateUserInput {
  /**
   * Full name of the user to be created.
   */
  @Field()
  name: string;

  /**
   * Email address of the user. Must be unique across the system.
   */
  @Field()
  email: string;
}
