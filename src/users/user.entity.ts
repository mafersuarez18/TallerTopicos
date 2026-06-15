import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * @class User
 *
 * Representa a un usuario dentro del sistema de gestión de tareas.
 * Los usuarios pueden ser asignados a tareas como responsables de completarlas.
 *
 * @ObjectType() le dice a NestJS GraphQL que esta clase es un tipo
 * de salida en el schema, es decir, puede ser parte de una respuesta.
 */
@ObjectType()
export class User {
  /**
   * Identificador único del usuario.
   * Generado automáticamente con UUID v4 al momento de crear el usuario.
   */
  @Field(() => ID)
  id: string;

  /**
   * Nombre completo del usuario.
   */
  @Field()
  name: string;

  /**
   * Correo electrónico del usuario.
   * Se usa para identificarlo de forma única en el sistema.
   */
  @Field()
  email: string;

  /**
   * Fecha y hora en que fue creado el usuario (formato ISO 8601).
   */
  @Field()
  createdAt: string;
}
