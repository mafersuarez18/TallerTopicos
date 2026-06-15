import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Función principal que arranca la aplicación NestJS.
 * Aquí se configura el interceptor de logs de forma global,
 * lo que nos permite aplicar AOP sin tocar ningún resolver o servicio.
 */
async function bootstrap() {
  // Creamos la app y habilitamos todos los niveles de log disponibles
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug', 'verbose'],
  });

  // Registramos el interceptor de logging de manera global.
  // Esto es programación orientada a aspectos (AOP): el logging
  // se aplica como un "aspecto" transversal a toda la aplicación
  // sin que los resolvers sepan que está ahí.
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Usamos la variable de entorno PORT o 3000 por defecto
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Task Manager API corriendo en: http://localhost:${port}/graphql`);
}

bootstrap();
