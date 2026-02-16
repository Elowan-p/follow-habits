import { HabitsError } from './habits.error';
import { DomainError } from 'core/error/domain.error';

describe('HabitsError', () => {
  it('should be defined and extend DomainError', () => {
    const error = new HabitsError({
      code: 'HABIT_ERROR',
      statusCode: 400,
      message: 'Habit error',
    });
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(HabitsError);
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should set properties correctly', () => {
    const params = {
      code: 'HABIT_ERROR',
      statusCode: 404,
      message: 'Habit not found',
      field: { id: 'invalid' },
    };
    const error = new HabitsError(params);

    expect(error.code).toBe(params.code);
    expect(error.statusCode).toBe(params.statusCode);
    expect(error.message).toBe(params.message);
    expect(error.field).toEqual(params.field);
  });
});
