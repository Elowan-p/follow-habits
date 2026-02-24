import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GroupRole } from '../entities/group-member.entity';

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'The new role to assign to the member',
    enum: GroupRole,
  })
  @IsEnum(GroupRole)
  @IsNotEmpty()
  role: GroupRole;
}
