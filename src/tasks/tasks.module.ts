import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

/**
 * @module TasksModule
 * @description NestJS module that encapsulates all task-related functionality.
 * Imports UsersModule and ProjectsModule to resolve task relationships.
 */
@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
