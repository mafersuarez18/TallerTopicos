import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * @class Project
 * @description GraphQL ObjectType representing a software development project.
 * Tasks belong to projects, providing organizational grouping.
 */
@ObjectType()
export class Project {
  /**
   * Unique identifier for the project (UUID v4).
   */
  @Field(() => ID)
  id: string;

  /**
   * Name of the project.
   */
  @Field()
  name: string;

  /**
   * Detailed description of the project's purpose and scope.
   */
  @Field()
  description: string;

  /**
   * ISO 8601 timestamp of when the project was created.
   */
  @Field()
  createdAt: string;
}
