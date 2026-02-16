import { DomainError } from 'core/error/domain.error';

export class HabitsError extends DomainError {
  constructor(params: {
    code: string;
    statusCode: number;
    message: string;
    field?: Record<string, unknown>;
    details?: Record<string, unknown>;
  }) {
    super(params);
  }
}
