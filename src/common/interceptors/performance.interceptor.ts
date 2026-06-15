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

/** Threshold in milliseconds above which an operation is flagged as slow */
const SLOW_OPERATION_THRESHOLD_MS = 500;

/**
 * @class PerformanceInterceptor
 * @implements {NestInterceptor}
 *
 * AOP-based performance monitoring interceptor — a cross-cutting concern
 * that measures the execution time of every GraphQL operation and emits
 * a warning when it exceeds the defined threshold.
 *
 * Keeping performance monitoring separate from business logic follows the
 * Aspect-Oriented Programming paradigm: performance concerns are handled
 * in one place and applied uniformly without touching any resolver or service.
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  /**
   * Intercepts the execution context to measure and report operation duration.
   *
   * @param {ExecutionContext} context - The current execution context
   * @param {CallHandler} next - The next handler in the interceptor chain
   * @returns {Observable<any>} The observable of the response with timing side effects
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const contextType = context.getType<string>();

    let operationLabel = 'Unknown';

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      const fieldName = info?.fieldName ?? 'Unknown';
      const parentType = info?.parentType?.name ?? 'Unknown';
      operationLabel = `${parentType}.${fieldName}`;
    }

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        if (elapsed > SLOW_OPERATION_THRESHOLD_MS) {
          this.logger.warn(
            `[Performance] SLOW operation detected: ${operationLabel} took ${elapsed}ms (threshold: ${SLOW_OPERATION_THRESHOLD_MS}ms)`,
          );
        } else {
          this.logger.debug(
            `[Performance] ${operationLabel} completed in ${elapsed}ms`,
          );
        }
      }),
    );
  }
}
