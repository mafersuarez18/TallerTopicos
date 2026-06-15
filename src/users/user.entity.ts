import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * @class User
 * @description GraphQL ObjectType representing a user in the task management system.
 * Users can be assigned to tasks as responsible members.
 */
@ObjectType()
export class User {
  /**
   * Unique identifier for the user (UUID v4).
   */
  @Field(() => ID)
  id: string;

  /**
   * Full name of the user.
   */
  @Field()
  name: string;

  /**
   * Email address of the user. Used for identification and notifications.
   */
  @Field()
  email: string;

  /**
   * ISO 8601 timestamp of when the user was created.
   */
  @Field()
  createdAt: string;
}
