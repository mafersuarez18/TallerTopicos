import { InputType, Field, ID } from '@nestjs/graphql';

/**
 * @class UpdateUserInput
 *
 * Datos necesarios para actualizar un usuario existente.
 * Solo el id es obligatorio; los demás campos son opcionales
 * para permitir actualizaciones parciales (no hay que mandar todo).
 */
@InputType()
export class UpdateUserInput {
  /**
   * ID del usuario que se quiere modificar.
   */
  @Field(() => ID)
  id: string;

  /**
   * Nuevo nombre del usuario (opcional).
   */
  @Field({ nullable: true })
  name?: string;

  /**
   * Nuevo correo del usuario (opcional).
   */
  @Field({ nullable: true })
  email?: string;
}
