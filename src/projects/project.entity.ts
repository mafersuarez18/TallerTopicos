import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * @class Project
 *
 * Representa un proyecto de desarrollo de software.
 * Cada tarea debe pertenecer a un proyecto, así organizamos
 * el trabajo por contexto o equipo.
 */
@ObjectType()
export class Project {
  /**
   * Identificador único del proyecto (UUID v4).
   */
  @Field(() => ID)
  id: string;

  /**
   * Nombre del proyecto.
   */
  @Field()
  name: string;

  /**
   * Descripción del proyecto: qué es, para qué sirve, etc.
   */
  @Field()
  description: string;

  /**
   * Fecha de creación del proyecto en formato ISO 8601.
   */
  @Field()
  createdAt: string;
}
