import { InputType, Field, ID } from '@nestjs/graphql';

/**
 * @class UpdateProjectInput
 *
 * Datos para actualizar un proyecto existente.
 * El id es el único campo obligatorio; nombre y descripción son opcionales
 * para poder hacer actualizaciones parciales.
 */
@InputType()
export class UpdateProjectInput {
  /**
   * ID del proyecto que se va a actualizar.
   */
  @Field(() => ID)
  id: string;

  /**
   * Nuevo nombre del proyecto (opcional).
   */
  @Field({ nullable: true })
  name?: string;

  /**
   * Nueva descripción del proyecto (opcional).
   */
  @Field({ nullable: true })
  description?: string;
}
