import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

/**
 * @module UsersModule
 *
 * Módulo que agrupa todo lo relacionado con usuarios:
 * el resolver (que maneja las queries/mutations de GraphQL)
 * y el servicio (que tiene la lógica de negocio).
 *
 * Exportamos el UsersService porque TasksModule lo necesita
 * para poder verificar que un usuario existe cuando se crea una tarea.
 */
@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService], // TasksModule va a necesitar este servicio
})
export class UsersModule {}
