import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';

/**
 * @module ProjectsModule
 * @description NestJS module that encapsulates all project-related functionality.
 * Exports ProjectsService so other modules (e.g., TasksModule) can inject it.
 */
@Module({
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
