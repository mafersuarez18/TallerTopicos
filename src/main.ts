import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @function bootstrap
 * Funcion de arranque de la aplicacion.
 * Los interceptores globales se registran desde AppModule con APP_INTERCEPTOR.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug', 'verbose'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Servidor corriendo en: http://localhost:${port}/graphql`);
}

bootstrap();
