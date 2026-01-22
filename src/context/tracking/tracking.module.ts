import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingEntity } from './entities/tracking.entity';
import { TrackingRepository } from './tracking.repository';
import { TrackingRepositoryInterface } from './tracking.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingEntity])],
  controllers: [TrackingController],
  providers: [
    TrackingService,
    { provide: TrackingRepositoryInterface, useClass: TrackingRepository },
  ],
  exports: [TrackingRepositoryInterface],
})
export class TrackingModule {}
