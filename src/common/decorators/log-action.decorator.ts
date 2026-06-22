import { Logger } from '@nestjs/common';

/**
 * @function LogAction
 *
 * Decorator de método que implementa AOP (Programación Orientada a Aspectos) a nivel de servicio.
 * Al aplicarlo sobre un método, ese método queda "envuelto" automáticamente:
 * se registra un log antes de ejecutar y otro al terminar (o si falla).
 *
 * Este es el principio de separación de concerns del AOP:
 * los servicios no saben que están siendo logueados; esa responsabilidad
 * vive exclusivamente aquí. Si mañana queremos cambiar el sistema de logs,
 * solo modificamos este archivo sin tocar ningún servicio.
 *
 * El decorator es transparente en cuanto a tipos:
 * - Si el método original es síncrono, retorna el valor directamente (no lo envuelve en Promise).
 * - Si el método original es asíncrono (retorna Promise), encadena los logs con .then/.catch.
 * Esto evita errores de tipos de TypeScript cuando el tipo de retorno declarado no es Promise.
 *
 * @param {string} [context] - Nombre del contexto para el Logger (generalmente el nombre de la clase)
 * @returns {MethodDecorator} Decorator que envuelve el método con logs de AOP
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
    const logger = new Logger(
      context ??
        (target as { constructor: { name: string } }).constructor.name,
    );

    // Guardamos referencia al método original antes de sobreescribirlo
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => unknown;

    const methodName = String(propertyKey);

    /**
     * Registra el éxito y devuelve el resultado sin modificarlo.
     * @param {unknown} result - Valor que devolvió el método original
     * @returns {unknown} El mismo valor recibido
     */
    const handleResult = (result: unknown): unknown => {
      logger.debug(`Completado [${methodName}]`);
      return result;
    };

    /**
     * Registra el error y lo relanza para que NestJS lo maneje normalmente.
     * @param {unknown} error - El error que lanzó el método original
     * @throws Siempre relanza el error recibido
     */
    const handleError = (error: unknown): never => {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Falló [${methodName}]: ${message}`);
      throw error;
    };

    // Reemplazamos el método con nuestra versión "envuelta"
    // IMPORTANTE: no declaramos la función como async para no cambiar
    // el tipo de retorno del método original (evitamos errores de TypeScript).
    descriptor.value = function (...args: unknown[]) {
      logger.debug(`Ejecutando [${methodName}]`);

      let result: unknown;

      try {
        // Ejecutamos el método original con su contexto (this) y sus argumentos
        result = originalMethod.apply(this, args);
      } catch (error: unknown) {
        // Error síncrono: lo logueamos y relanzamos inmediatamente
        return handleError(error);
      }

      // Si el método es async, encadenamos los logs sobre la Promise
      if (result instanceof Promise) {
        return result.then(handleResult, handleError);
      }

      // Si el método es síncrono, logueamos y devolvemos el valor directamente
      return handleResult(result);
    };

    return descriptor;
  };
}
