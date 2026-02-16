import { StatsError } from './stats.error';
import { DomainError } from 'core/error/domain.error';

describe('StatsError', () => {
  it('should be defined and extend DomainError', () => {
    const error = new StatsError({
      code: 'STATS_ERROR',
      statusCode: 500,
      message: 'Stats error',
    });
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(StatsError);
    expect(error).toBeInstanceOf(DomainError);
  });
});
