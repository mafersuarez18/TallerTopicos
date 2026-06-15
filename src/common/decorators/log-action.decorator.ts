import { Logger } from '@nestjs/common';

/**
 * @function LogAction
 *
 * Decorator de método que implementa AOP a nivel de servicio.
 * Cuando lo ponemos arriba de un método, ese método queda "envuelto"
 * automáticamente: se loguea antes de ejecutar y al terminar (o si falla).
 *
 * La ventaja es que los servicios quedan limpios de lógica de logging.
 * Solo nos enfocamos en la lógica de negocio y este decorator se encarga del resto.
 *
 * @param {string} [context] - Nombre del contexto que aparece en el log (generalmente el nombre de la clase)
 * @returns {MethodDecorator} Decorator que envuelve el método con logs
 *
 * @example
 * // En vez de poner console.log dentro del método, usamos el decorator:
 * @LogAction('TasksService')
 * create(input: CreateTaskInput): Task { ... }
 */
export function LogAction(context?: string): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    // Si no pasan un contexto, usamos el nombre de la clase que contiene el método
    const logger = new Logger(context ?? (target as { constructor: { name: string } }).constructor.name);

    // Guardamos referencia al método original antes de sobreescribirlo
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    // Reemplazamos el método con nuestra versión "envuelta"
    descriptor.value = async function (...args: unknown[]) {
      logger.debug(`Ejecutando [${String(propertyKey)}]`);
      try {
        // Ejecutamos el método original con sus argumentos
        const result = await originalMethod.apply(this, args);
        logger.debug(`Completado [${String(propertyKey)}]`);
        return result;
      } catch (error: unknown) {
        // Si el método lanza un error, lo logueamos y lo relanzamos
        // para que NestJS lo maneje con su sistema de excepciones
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Falló [${String(propertyKey)}]: ${message}`);
        throw error;
      }
    };

    return descriptor;
  };
}
