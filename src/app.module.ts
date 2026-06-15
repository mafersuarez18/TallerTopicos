import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';

/**
 * @module AppModule
 *
 * Módulo raíz de la aplicación. Desde acá se conectan todos los módulos
 * (usuarios, proyectos, tareas) y se configura GraphQL con Apollo.
 *
 * También es el lugar donde registramos los interceptores de forma global.
 * Eso es la clave del AOP: en vez de poner el logging en cada resolver,
 * lo declaramos una sola vez aquí y NestJS se encarga de aplicarlo en todos lados.
 */
@Module({
  imports: [
    // Configuramos GraphQL en modo "code-first": el schema se genera
    // automáticamente a partir de los decoradores de TypeScript.
    // Con autoSchemaFile le decimos dónde guardar el .gql generado.
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // playground: true permite usar el explorador de GraphQL en el browser
      playground: true,
    }),

    // Importamos cada módulo de dominio de la aplicación
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
  providers: [
    // --- AOP: registro global de interceptores ---
    // Al usar APP_INTERCEPTOR, NestJS aplica el interceptor a TODOS
    // los resolvers y controladores sin que ellos lo sepan.
    // Eso es exactamente el principio de separación de concerns del AOP.
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // registra inicio, fin y errores de cada operación
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor, // mide el tiempo de cada operación
    },
  ],
})
export class AppModule {}
