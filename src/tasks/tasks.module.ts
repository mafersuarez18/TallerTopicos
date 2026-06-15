import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

/**
 * @module TasksModule
 *
 * Módulo de tareas: el más importante de la aplicación.
 * Importa UsersModule y ProjectsModule porque al crear/actualizar
 * una tarea necesitamos acceder a los servicios de esos módulos
 * para validar que el usuario y el proyecto existan.
 */
@Module({
  // Necesitamos acceso a UsersService y ProjectsService
  imports: [UsersModule, ProjectsModule],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
