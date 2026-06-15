import { InputType, Field } from '@nestjs/graphql';

/**
 * @class CreateUserInput
 *
 * Define los datos que hay que mandar para crear un usuario nuevo.
 * @InputType() lo convierte en un tipo de entrada de GraphQL,
 * o sea, es lo que el cliente envía en la mutation.
 */
@InputType()
export class CreateUserInput {
  /**
   * Nombre completo del nuevo usuario.
   */
  @Field()
  name: string;

  /**
   * Correo electrónico del usuario.
   */
  @Field()
  email: string;
}
