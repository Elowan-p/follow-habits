import { PartialType } from '@nestjs/swagger';
import { CreateTrackingDTO } from './create-tracking.dto';

export class UpdateTrackingDTO extends PartialType(CreateTrackingDTO) {}
