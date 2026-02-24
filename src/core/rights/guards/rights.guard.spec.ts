import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RightsGuard } from './rights.guard';
import { RIGHTS_KEY } from '../decorators/require-rights.decorator';
import { SYSTEM_MANAGE, GROUPS_CREATE, GROUPS_READ } from '../rights.constants';
import { ROLE_USER, ROLE_ADMIN } from '../roles';

describe('RightsGuard', () => {
  let guard: RightsGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RightsGuard(reflector);
  });

  const createMockContext = (userRights?: bigint): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: userRights !== undefined ? { rights: userRights } : undefined,
        }),
      }),
    } as any;
  };

  it('should allow access if no rights are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user has no rights', () => {
    reflector.getAllAndOverride.mockReturnValue(GROUPS_CREATE);
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow('Insufficient rights: No user rights found');
  });

  describe('Standard User Role (ROLE_USER)', () => {
    it('should allow access if user has the exact required granular right', () => {
      reflector.getAllAndOverride.mockReturnValue(GROUPS_CREATE);
      const context = createMockContext(ROLE_USER);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException if user lacks the specific required right', () => {
      reflector.getAllAndOverride.mockReturnValue(GROUPS_CREATE);
      const userWithOnlyRead = GROUPS_READ;
      const context = createMockContext(userWithOnlyRead);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('Insufficient rights');
    });
  });

  describe('Admin User Role (ROLE_ADMIN with SYSTEM_MANAGE)', () => {
    it('should allow access to ANY protected route, bypassing granular checks', () => {
      const FICTIONAL_RIGHT = 1n << 50n;
      reflector.getAllAndOverride.mockReturnValue(FICTIONAL_RIGHT);
      const context = createMockContext(ROLE_ADMIN);
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should still allow access to standard routes', () => {
      reflector.getAllAndOverride.mockReturnValue(GROUPS_CREATE);
      const context = createMockContext(ROLE_ADMIN);

      expect(guard.canActivate(context)).toBe(true);
    });
  });
  describe('Stringified rights conversion (DB BigInt format)', () => {
     it('should handle rights provided as strings', () => {
        reflector.getAllAndOverride.mockReturnValue(GROUPS_CREATE);

        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: () => ({
              getRequest: () => ({
                user: { rights: ROLE_USER.toString() }, // Pass as string
              }),
            }),
          } as any;
          
        expect(guard.canActivate(context)).toBe(true);
     });
  });

});
