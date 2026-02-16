import { DomainError } from './domain.error';

describe('DomainError', () => {
  it('should be defined', () => {
    const error = new DomainError({
      code: 'TEST_ERROR',
      statusCode: 400,
      message: 'Test error message',
    });
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should set properties correctly', () => {
    const params = {
      code: 'TEST_ERROR',
      statusCode: 400,
      message: 'Test error message',
      field: { fieldName: 'error' },
      details: { info: 'details' },
    };
    const error = new DomainError(params);

    expect(error.code).toBe(params.code);
    expect(error.statusCode).toBe(params.statusCode);
    expect(error.message).toBe(params.message);
    expect(error.field).toEqual(params.field);
    expect(error.details).toEqual(params.details);
  });
});
