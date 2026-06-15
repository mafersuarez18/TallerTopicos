import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from './enums/task-status.enum';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

/**
 * @class Task
 *
 * Entidad principal del sistema: representa una tarea dentro de un proyecto.
 * Una tarea siempre pertenece a un proyecto y tiene un usuario responsable.
 *
 * Los campos de relación (assignedUser, project) se resuelven desde los
 * servicios correspondientes al momento de crear o actualizar la tarea.
 */
@ObjectType()
export class Task {
  /**
   * Identificador único de la tarea (UUID v4).
   */
  @Field(() => ID)
  id: string;

  /**
   * Título corto y descriptivo de la tarea.
   */
  @Field()
  title: string;

  /**
   * Descripción detallada de qué hay que hacer y por qué.
   */
  @Field()
  description: string;

  /**
   * Estado actual de la tarea dentro del flujo de trabajo.
   * Puede ser BACKLOG, TODO, IN_PROGRESS o DONE.
   * @see TaskStatus
   */
  @Field(() => TaskStatus)
  status: TaskStatus;

  /**
   * Etiquetas para categorizar y filtrar tareas (ej: ["bug", "frontend", "urgente"]).
   * Es un arreglo dinámico que puede estar vacío.
   */
  @Field(() => [String])
  tags: string[];

  /**
   * Fecha y hora de creación de la tarea (ISO 8601).
   */
  @Field()
  createdAt: string;

  /**
   * Usuario asignado como responsable de completar la tarea.
   */
  @Field(() => User)
  assignedUser: User;

  /**
   * Proyecto al que pertenece esta tarea.
   */
  @Field(() => Project)
  project: Project;
}
