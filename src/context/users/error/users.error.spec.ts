import { UsersError } from './users.error';
import { DomainError } from 'core/error/domain.error';

describe('UsersError', () => {
  it('should be defined and extend DomainError', () => {
    const error = new UsersError({
      code: 'USER_ERROR',
      statusCode: 404,
      message: 'User not found',
    });
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UsersError);
    expect(error).toBeInstanceOf(DomainError);
  });
});
