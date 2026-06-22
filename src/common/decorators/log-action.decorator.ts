import { Logger } from '@nestjs/common';

/**
 * @function LogAction
 *
 * Decorator de metodo para aplicar AOP a nivel de servicio.
 * Registra un log al inicio y al final de cada metodo decorado,
 * y captura los errores antes de relanzarlos.
 *
 * La idea es que los servicios no mezclen logica de negocio con logs.
 * Este decorator se encarga del logging y los metodos solo hacen su trabajo.
 *
 * Funciona con metodos sincronos y asincronos sin cambiar el tipo de retorno:
 * si el metodo retorna una Promise, encadena los logs; si es sincrono, los hace directo.
 *
 * @param {string} [context] - Nombre de la clase o modulo para identificar el log
 * @returns {MethodDecorator} Decorator que agrega logs al metodo
 *
 * @example
 * @LogAction('TasksService')
 * create(input: CreateTaskInput): Task { ... }
 */
export function LogAction(context?: string): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const logger = new Logger(
      context ??
        (target as { constructor: { name: string } }).constructor.name,
    );

    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => unknown;

    const methodName = String(propertyKey);

    // Reemplazamos el metodo original con una version que agrega logs
    // No usamos async para no cambiar el tipo de retorno del metodo original
    descriptor.value = function (...args: unknown[]) {
      logger.debug(`Ejecutando [${methodName}]`);

      let result: unknown;

      try {
        result = originalMethod.apply(this, args);
      } catch (error: unknown) {
        // Error sincrono: logueamos y relanzamos
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Error en [${methodName}]: ${message}`);
        throw error;
      }

      // Si es async, encadenamos el log al resultado de la Promise
      if (result instanceof Promise) {
        return result.then(
          (value: unknown) => {
            logger.debug(`Completado [${methodName}]`);
            return value;
          },
          (error: unknown) => {
            const message =
              error instanceof Error ? error.message : String(error);
            logger.error(`Error en [${methodName}]: ${message}`);
            throw error;
          },
        );
      }

      // Metodo sincrono: logueamos y devolvemos el valor
      logger.debug(`Completado [${methodName}]`);
      return result;
    };

    return descriptor;
  };
}
