import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * @class CreateTaskInput
 *
 * Datos necesarios para crear una tarea nueva.
 * El título, descripción, usuario y proyecto son obligatorios.
 * Las etiquetas y el estado son opcionales (por defecto el estado es BACKLOG).
 */
@InputType()
export class CreateTaskInput {
  /**
   * Título corto de la tarea.
   */
  @Field()
  title: string;

  /**
   * Descripción detallada de lo que hay que hacer.
   */
  @Field()
  description: string;

  /**
   * Estado inicial de la tarea.
   * Si no se pasa, se asigna BACKLOG por defecto.
   */
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  /**
   * Etiquetas para clasificar la tarea (ej: ["bug", "ui"]).
   * Si no se pasa, queda como arreglo vacío.
   */
  @Field(() => [String], { nullable: true })
  tags?: string[];

  /**
   * ID del usuario que va a ser responsable de esta tarea.
   */
  @Field(() => ID)
  assignedUserId: string;

  /**
   * ID del proyecto al que pertenece la tarea.
   */
  @Field(() => ID)
  projectId: string;
}
