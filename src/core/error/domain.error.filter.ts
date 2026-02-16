import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from './domain.error';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter<DomainError> {
  private readonly logger = new Logger(DomainErrorFilter.name);

  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.statusCode;
    const errorResponse = {
      statusCode: status,
      message: exception.message,
      code: exception.code,
      details: exception.details,
      field: exception.field,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `Domain Error: ${exception.message}`,
      JSON.stringify(errorResponse),
    );

    response.status(status).json(errorResponse);
  }
}
