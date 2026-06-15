import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * @class UpdateTaskInput
 *
 * Datos para actualizar una tarea existente.
 * Solo el id es obligatorio; todos los demás son opcionales.
 * Esto permite actualizar solo lo que necesitemos:
 * por ejemplo, solo cambiar el estado sin tocar las etiquetas ni el usuario.
 */
@InputType()
export class UpdateTaskInput {
  /**
   * ID de la tarea que se quiere modificar.
   */
  @Field(() => ID)
  id: string;

  /**
   * Nuevo título de la tarea (opcional).
   */
  @Field({ nullable: true })
  title?: string;

  /**
   * Nueva descripción (opcional).
   */
  @Field({ nullable: true })
  description?: string;

  /**
   * Nuevo estado de la tarea (opcional).
   * Útil para mover la tarea entre columnas: TODO → IN_PROGRESS → DONE.
   */
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  /**
   * Nuevo arreglo de etiquetas (opcional).
   * Reemplaza las etiquetas actuales, no las agrega.
   */
  @Field(() => [String], { nullable: true })
  tags?: string[];

  /**
   * ID del nuevo usuario asignado (opcional).
   * Permite reasignar la tarea a otra persona.
   */
  @Field(() => ID, { nullable: true })
  assignedUserId?: string;

  /**
   * ID del proyecto destino (opcional).
   * Permite mover la tarea a otro proyecto.
   */
  @Field(() => ID, { nullable: true })
  projectId?: string;
}
