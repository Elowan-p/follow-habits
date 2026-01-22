import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException(`Tracking with ID ${id} not found`);
    }
    return tracking;
  }

  async update(id: string, updateTrackingDto: UpdateTrackingDTO) {
    const tracking = await this.trackingRepository.findOne(id);
    if (!tracking) {
      throw new NotFoundException(`Tracking with ID ${id} not found`);
    }

    const updatedTracking = { ...tracking, ...updateTrackingDto };
    // Conversion de date si présente dans le DTO
    if (updateTrackingDto.date) {
      updatedTracking.date = new Date(updateTrackingDto.date);
    }

    return this.trackingRepository.update(updatedTracking as TrackingEntity);
  }

  async remove(id: string) {
    const tracking = await this.trackingRepository.findOne(id);
    if (!tracking) {
      throw new NotFoundException(`Tracking with ID ${id} not found`);
    }
    return this.trackingRepository.remove(tracking);
  }
}
