import { Logger } from '@nestjs/common';

/**
 * @function LogAction
 *
 * Method decorator implementing AOP advice for service-level operation logging.
 * Wraps the decorated method and logs its invocation and result as a
 * cross-cutting concern, keeping business logic clean of logging code.
 *
 * @param {string} [context] - Optional label to identify the class/context in logs
 * @returns {MethodDecorator} A method decorator that adds logging behavior
 *
 * @example
 * class TasksService {
 *   @LogAction('TasksService')
 *   async createTask(input: CreateTaskInput) { ... }
 * }
 */
export function LogAction(context?: string): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const logger = new Logger(context ?? (target as { constructor: { name: string } }).constructor.name);
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = async function (...args: unknown[]) {
      logger.debug(`Executing [${String(propertyKey)}]`);
      try {
        const result = await originalMethod.apply(this, args);
        logger.debug(`Completed [${String(propertyKey)}]`);
        return result;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Failed [${String(propertyKey)}]: ${message}`);
        throw error;
      }
    };

    return descriptor;
  };
}
