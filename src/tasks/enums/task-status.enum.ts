import { registerEnumType } from '@nestjs/graphql';

/**
 * @enum TaskStatus
 *
 * Los posibles estados de una tarea dentro del sistema.
 * Siguen el flujo típico de trabajo de un equipo de desarrollo:
 * BACKLOG → TODO → IN_PROGRESS → DONE
 */
export enum TaskStatus {
  // La tarea existe pero aún no está planificada para ningún sprint
  BACKLOG = 'BACKLOG',

  // Está planificada y lista para que alguien la tome
  TODO = 'TODO',

  // Alguien la está trabajando activamente
  IN_PROGRESS = 'IN_PROGRESS',

  // Terminada
  DONE = 'DONE',
}

// Registramos el enum en GraphQL para que sea visible en el schema
// y el playground pueda mostrar las opciones disponibles
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados posibles de una tarea en el sistema',
  valuesMap: {
    BACKLOG: { description: 'Tarea identificada pero aún no planificada' },
    TODO: { description: 'Tarea lista para comenzar' },
    IN_PROGRESS: { description: 'Tarea en progreso actualmente' },
    DONE: { description: 'Tarea completada' },
  },
});
