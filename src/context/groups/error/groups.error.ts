import { DomainError } from 'core/error/domain.error';

export class GroupsError extends DomainError {
  constructor(params: {
    code: string;
    message: string;
    details?: Record<string, any>;
    statusCode?: number;
  }) {
    super(params as any);
  }

  static groupNotFound(id: string): GroupsError {
    return new GroupsError({
      code: 'GROUP_NOT_FOUND',
      message: `Group with ID ${id} not found`,
      statusCode: 404,
    });
  }

  static habitNotFound(id: string): GroupsError {
    return new GroupsError({
      code: 'GROUP_HABIT_NOT_FOUND',
      message: `Group habit with ID ${id} not found`,
      statusCode: 404,
    });
  }

  static notMember(): GroupsError {
    return new GroupsError({
      code: 'NOT_GROUP_MEMBER',
      message: 'User is not a member of this group',
      statusCode: 403,
    });
  }

  static alreadyTrackedToday(): GroupsError {
    return new GroupsError({
      code: 'ALREADY_TRACKED_TODAY',
      message: 'You have already tracked this group habit today',
      statusCode: 400,
    });
  }
}
