import { TrackingError } from './tracking.error';
import { DomainError } from 'core/error/domain.error';

describe('TrackingError', () => {
  it('should be defined and extend DomainError', () => {
    const error = new TrackingError({
      code: 'TRACKING_ERROR',
      statusCode: 400,
      message: 'Tracking error',
    });
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(TrackingError);
    expect(error).toBeInstanceOf(DomainError);
  });
});
