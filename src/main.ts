import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Bootstrap function that initializes and starts the NestJS application.
 * Configures the global logging interceptor as an AOP cross-cutting concern.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug', 'verbose'],
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Task Manager API running on: http://localhost:${port}/graphql`);
}

bootstrap();
