import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @function bootstrap
 *
 * Función principal que arranca la aplicación NestJS.
 *
 * Los interceptores AOP (LoggingInterceptor y PerformanceInterceptor) se registran
 * de forma global en AppModule usando APP_INTERCEPTOR, siguiendo el principio de
 * Programación Orientada a Aspectos (AOP): el logging y el monitoreo de performance
 * se aplican como "aspectos" transversales a toda la aplicación sin que los resolvers
 * o servicios sepan que están siendo monitoreados.
 *
 * No hace falta registrarlos aquí también: hacerlo generaría logs duplicados
 * por cada operación de GraphQL.
 */
async function bootstrap() {
  // Creamos la app habilitando todos los niveles de log disponibles
  // para que los interceptores y decoradores AOP puedan mostrar sus mensajes
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug', 'verbose'],
  });

  // Usamos la variable de entorno PORT o 3000 por defecto
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Task Manager API corriendo en: http://localhost:${port}/graphql`);
}

bootstrap();
