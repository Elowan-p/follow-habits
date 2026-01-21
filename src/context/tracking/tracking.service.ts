import { Injectable } from '@nestjs/common';
import { CreateTrackingDTO } from './dto/create-tracking.dto';
import { UpdateTrackingDTO } from './dto/update-tracking.dto';

interface Tracking {
  id: string;
  habitId: string;
  date: string;
  status: string;
}

@Injectable()
export class TrackingService {
  private trackings: Tracking[] = [];
  
  create(createTrackingDto: CreateTrackingDTO) {
    const tracking: Tracking = { id: Date.now().toString(), ...createTrackingDto };
    this.trackings.push(tracking);
    return tracking;
  }

  findAll() {
    return this.trackings;
  }

  findOne(id: string) {
    return this.trackings.find((tracking) => tracking.id === id);
  }

  update(id: string, updateTrackingDto: UpdateTrackingDTO) {
    const trackingIndex = this.trackings.findIndex((tracking) => tracking.id === id);
    if (trackingIndex > -1) {
      this.trackings[trackingIndex] = {
        ...this.trackings[trackingIndex],
        ...updateTrackingDto,
      };
      return this.trackings[trackingIndex];
    }
    return null;
  }

  remove(id: string) {
    const trackingIndex = this.trackings.findIndex((tracking) => tracking.id === id);
    if (trackingIndex > -1) {
      const deletedTracking = this.trackings[trackingIndex];
      this.trackings.splice(trackingIndex, 1);
      return deletedTracking;
    }
    return null;
  }
}
