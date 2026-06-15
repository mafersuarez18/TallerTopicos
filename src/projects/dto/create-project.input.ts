import { InputType, Field } from '@nestjs/graphql';

/**
 * @class CreateProjectInput
 *
 * Datos requeridos para crear un proyecto nuevo.
 * Tanto el nombre como la descripción son obligatorios.
 */
@InputType()
export class CreateProjectInput {
  /**
   * Nombre del proyecto.
   */
  @Field()
  name: string;

  /**
   * Descripción del proyecto.
   */
  @Field()
  description: string;
}
