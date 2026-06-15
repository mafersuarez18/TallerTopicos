import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 *
 * Interceptor de logging que actúa como un aspecto transversal (AOP).
 * La idea es que el logging no debería estar dentro de cada resolver o servicio,
 * sino separado en su propia clase que se "envuelve" alrededor de cualquier operación.
 *
 * Cada vez que se ejecuta una query o mutation de GraphQL, este interceptor:
 * - Loguea el nombre de la operación al inicio
 * - Loguea cuánto tardó al finalizar
 * - Captura cualquier error y lo loguea antes de relanzarlo
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Logger de NestJS, usa el nombre de la clase para identificar la fuente del log
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Método principal del interceptor. NestJS lo llama automáticamente
   * antes de ejecutar cualquier handler (resolver/controller).
   *
   * @param {ExecutionContext} context - Contexto de ejecución actual (puede ser HTTP o GraphQL)
   * @param {CallHandler} next - El siguiente handler en la cadena de ejecución
   * @returns {Observable<any>} Observable con el resultado de la operación
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Guardamos el timestamp de inicio para calcular la duración después
    const now = Date.now();
    const contextType = context.getType<string>();

    let operationName = 'Unknown';

    if (contextType === 'graphql') {
      // Si es una operación GraphQL, extraemos el nombre del campo y el tipo padre
      // (ej: "Query.tasks" o "Mutation.createTask")
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      operationName = info?.fieldName ?? 'Unknown';
      const operationType = info?.parentType?.name ?? 'Unknown';
      this.logger.log(`[GraphQL] ${operationType}.${operationName} - INICIO`);
    } else {
      // Para peticiones HTTP normales (aunque en esta app todo es GraphQL)
      const req = context.switchToHttp().getRequest();
      operationName = `${req?.method} ${req?.url}`;
      this.logger.log(`[HTTP] ${operationName} - INICIO`);
    }

    // Usamos pipe() de RxJS para agregar efectos secundarios (logs)
    // sin modificar el resultado que devuelve el handler
    return next.handle().pipe(
      // tap se ejecuta cuando la operación completa sin errores
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.log(
          `[GraphQL] ${operationName} - COMPLETADO en ${elapsed}ms`,
        );
      }),
      // catchError se ejecuta si la operación lanza una excepción
      catchError((error: unknown) => {
        const elapsed = Date.now() - now;
        const message =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `[GraphQL] ${operationName} - ERROR después de ${elapsed}ms: ${message}`,
        );
        // Es importante relanzar el error para que NestJS lo maneje correctamente
        return throwError(() => error);
      }),
    );
  }
}
