import { PartialType } from '@nestjs/swagger';
import { CreateStatDTO } from './create-stat.dto';

export class UpdateStatDTO extends PartialType(CreateStatDTO) {}
