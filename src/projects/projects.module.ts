import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';

/**
 * @module ProjectsModule
 *
 * Módulo que agrupa el resolver y el servicio de proyectos.
 * Exportamos ProjectsService porque TasksModule lo necesita
 * para verificar que el proyecto de una tarea exista.
 */
@Module({
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService], // lo necesita TasksModule
})
export class ProjectsModule {}
