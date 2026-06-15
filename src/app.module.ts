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
 * @description Root application module that wires together all feature modules
 * and applies global cross-cutting concerns via AOP interceptors.
 *
 * The GraphQL module is configured in code-first mode, generating the schema
 * automatically from TypeScript decorators. The LoggingInterceptor is registered
 * as a global provider following the AOP pattern, ensuring every resolver
 * operation is transparently logged without modifying business logic.
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
  providers: [
    {
      /**
       * Global AOP interceptor registration.
       * LoggingInterceptor is applied to every resolver as a cross-cutting concern,
       * separating logging from business logic per the AOP paradigm.
       */
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      /**
       * Global AOP performance interceptor registration.
       * PerformanceInterceptor measures execution time and warns on slow operations,
       * acting as a separate cross-cutting concern independent of business logic.
       */
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule {}
