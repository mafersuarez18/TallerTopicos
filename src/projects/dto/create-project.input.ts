import { InputType, Field } from '@nestjs/graphql';

/**
 * @class CreateProjectInput
 * @description GraphQL InputType for creating a new project.
 */
@InputType()
export class CreateProjectInput {
  /**
   * Name of the project to be created.
   */
  @Field()
  name: string;

  /**
   * Detailed description of the project.
   */
  @Field()
  description: string;
}
