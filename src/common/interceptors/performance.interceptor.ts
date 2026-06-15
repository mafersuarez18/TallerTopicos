import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

// Si una operación tarda más de esto, la marcamos como "lenta" en los logs
const SLOW_OPERATION_THRESHOLD_MS = 500;

/**
 * @class PerformanceInterceptor
 * @implements {NestInterceptor}
 *
 * Segundo interceptor AOP de la aplicación, dedicado al monitoreo de rendimiento.
 * Mide cuánto tiempo tarda cada operación de GraphQL y lanza una advertencia
 * si supera el umbral definido arriba.
 *
 * Separar esto del LoggingInterceptor es importante: cada aspecto tiene
 * una sola responsabilidad. El logging loguea el flujo, este mide el tiempo.
 * Si mañana queremos quitar el monitoreo de performance, solo removemos este interceptor.
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  /**
   * Mide el tiempo de ejecución de cada operación GraphQL.
   *
   * @param {ExecutionContext} context - Contexto de ejecución de NestJS
   * @param {CallHandler} next - Handler que ejecuta el resolver real
   * @returns {Observable<any>} El mismo resultado del resolver, sin modificaciones
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Marcamos el momento de inicio
    const start = Date.now();
    const contextType = context.getType<string>();

    // Construimos una etiqueta legible para identificar la operación en los logs
    let operationLabel = 'Unknown';

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      const fieldName = info?.fieldName ?? 'Unknown';
      const parentType = info?.parentType?.name ?? 'Unknown';
      // Ejemplo del resultado: "Query.tasks" o "Mutation.createTask"
      operationLabel = `${parentType}.${fieldName}`;
    }

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;

        // Si superó el umbral, avisamos con un warning para que se pueda investigar
        if (elapsed > SLOW_OPERATION_THRESHOLD_MS) {
          this.logger.warn(
            `[Performance] Operación LENTA detectada: ${operationLabel} tardó ${elapsed}ms (umbral: ${SLOW_OPERATION_THRESHOLD_MS}ms)`,
          );
        } else {
          // Si está dentro del tiempo esperado, solo lo registramos en debug
          this.logger.debug(
            `[Performance] ${operationLabel} completado en ${elapsed}ms`,
          );
        }
      }),
    );
  }
}
