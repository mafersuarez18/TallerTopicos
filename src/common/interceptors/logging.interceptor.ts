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
 * AOP-based logging interceptor that acts as a cross-cutting concern.
 * Intercepts every GraphQL operation and logs:
 * - The operation name and type before execution
 * - The execution duration after completion
 * - Any errors that occur during execution
 *
 * This follows the Aspect-Oriented Programming paradigm by separating
 * logging logic from business logic.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepts the execution context and wraps the handler call with logging.
   *
   * @param {ExecutionContext} context - The current execution context (HTTP or GraphQL)
   * @param {CallHandler} next - The next handler in the interceptor chain
   * @returns {Observable<any>} The observable of the response with logging side effects
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const contextType = context.getType<string>();

    let operationName = 'Unknown';

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      operationName = info?.fieldName ?? 'Unknown';
      const operationType = info?.parentType?.name ?? 'Unknown';
      this.logger.log(`[GraphQL] ${operationType}.${operationName} - START`);
    } else {
      const req = context.switchToHttp().getRequest();
      operationName = `${req?.method} ${req?.url}`;
      this.logger.log(`[HTTP] ${operationName} - START`);
    }

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.log(
          `[GraphQL] ${operationName} - COMPLETED in ${elapsed}ms`,
        );
      }),
      catchError((error: unknown) => {
        const elapsed = Date.now() - now;
        const message =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `[GraphQL] ${operationName} - ERROR after ${elapsed}ms: ${message}`,
        );
        return throwError(() => error);
      }),
    );
  }
}
