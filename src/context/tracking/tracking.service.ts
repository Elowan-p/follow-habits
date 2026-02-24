import { Injectable } from '@nestjs/common';
import { TrackingError } from './error/tracking.error';
import { CreateTrackingDTO } from './dto/create-tracking.dto';
import { UpdateTrackingDTO } from './dto/update-tracking.dto';
import { TrackingRepositoryInterface } from './tracking.repository.interface';
import { TrackingEntity } from './entities/tracking.entity';

@Injectable()
export class TrackingService {
  constructor(
    private readonly trackingRepository: TrackingRepositoryInterface,
  ) {}

  async create(createTrackingDto: CreateTrackingDTO) {
    const tracking = new TrackingEntity();
    tracking.habit = { id: createTrackingDto.habitId } as any;
    tracking.status = createTrackingDto.status;
    tracking.date = new Date(createTrackingDto.date);

    return this.trackingRepository.create(tracking);
  }

  async findAll() {
    return this.trackingRepository.findAll();
  }

  async findOne(id: string) {
    const tracking = await this.trackingRepository.findOne(id);
    if (!tracking) {
      throw new TrackingError({
        code: 'TRACKING_NOT_FOUND',
        message: `Tracking with ID ${id} not found`,
        statusCode: 404,
      });
    }
    return tracking;
  }

  async update(id: string, updateTrackingDto: UpdateTrackingDTO) {
    const tracking = await this.trackingRepository.findOne(id);
    if (!tracking) {
      throw new TrackingError({
        code: 'TRACKING_NOT_FOUND',
        message: `Tracking with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const updatedTracking = { ...tracking, ...updateTrackingDto };

    if (updateTrackingDto.date) {
      updatedTracking.date = new Date(updateTrackingDto.date);
    }

    return this.trackingRepository.update(updatedTracking as TrackingEntity);
  }

  async remove(id: string) {
    const tracking = await this.trackingRepository.findOne(id);
    if (!tracking) {
      throw new TrackingError({
        code: 'TRACKING_NOT_FOUND',
        message: `Tracking with ID ${id} not found`,
        statusCode: 404,
      });
    }
    return this.trackingRepository.remove(tracking);
  }
}
