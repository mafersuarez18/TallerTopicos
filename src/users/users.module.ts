import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

/**
 * @module UsersModule
 * @description NestJS module that encapsulates all user-related functionality.
 * Exports UsersService so other modules (e.g., TasksModule) can inject it.
 */
@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
