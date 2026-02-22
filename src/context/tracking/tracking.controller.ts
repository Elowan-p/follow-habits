import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDTO } from './dto/create-tracking.dto';
import { UpdateTrackingDTO } from './dto/update-tracking.dto';
import { TrackingPresenter } from './presenter/tracking.presenter';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { RequireRights } from '../../core/rights/decorators/require-rights.decorator';
import {
  TRACKING_CREATE,
  TRACKING_READ,
  TRACKING_UPDATE,
  TRACKING_DELETE,
} from '../../core/rights/rights.constants';

@ApiTags('Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RightsGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Create tracking' })
  @ApiResponse({ status: 201, type: TrackingPresenter })
  @RequireRights(TRACKING_CREATE)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackingDto: CreateTrackingDTO) {
    const tracking = this.trackingService.create(createTrackingDto);
    return plainToInstance(TrackingPresenter, tracking);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trackings' })
  @ApiResponse({ status: 200, type: [TrackingPresenter] })
  @RequireRights(TRACKING_READ)
  @HttpCode(HttpStatus.OK)
  findAll() {
    const trackings = this.trackingService.findAll();
    return plainToInstance(TrackingPresenter, trackings);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tracking by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: TrackingPresenter })
  @RequireRights(TRACKING_READ)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    const tracking = this.trackingService.findOne(id);
    return plainToInstance(TrackingPresenter, tracking);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tracking' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: TrackingPresenter })
  @RequireRights(TRACKING_UPDATE)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTrackingDto: UpdateTrackingDTO,
  ) {
    const tracking = this.trackingService.update(id, updateTrackingDto);
    return plainToInstance(TrackingPresenter, tracking);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tracking' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: TrackingPresenter })
  @RequireRights(TRACKING_DELETE)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const tracking = this.trackingService.remove(id);
    return plainToInstance(TrackingPresenter, tracking);
  }
}
