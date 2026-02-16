/* eslint-disable prettier/prettier */
export class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly field?: Record<string, unknown>;
  public readonly details?: Record<string, unknown>;

  constructor(params: {
    code: string;
    statusCode: number;
    message: string;
    field?: Record<string, unknown>;
    details?: Record<string, unknown>;
  }) {
    super(params.message);
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.field = params.field;
    this.details = params.details;
  }
}
