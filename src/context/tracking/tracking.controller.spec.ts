import { Test, TestingModule } from '@nestjs/testing';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { CreateTrackingDTO } from './dto/create-tracking.dto';
import { UpdateTrackingDTO } from './dto/update-tracking.dto';
import { TrackingPresenter } from './presenter/tracking.presenter';

describe('TrackingController', () => {
  let controller: TrackingController;

  const mockTrackingService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        {
          provide: TrackingService,
          useValue: mockTrackingService,
        },
      ],
    }).compile();

    controller = module.get<TrackingController>(TrackingController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call trackingService.create and return presenter', () => {
      const dto: CreateTrackingDTO = {
        habitId: 'h1',
        isCompleted: true,
        date: new Date().toISOString(),
      };
      mockTrackingService.create.mockReturnValue({ id: 't1', ...dto });

      const result = controller.create(dto);
      expect(mockTrackingService.create).toHaveBeenCalledWith(dto);
      expect(result).toBeInstanceOf(TrackingPresenter);
      expect(result.id).toBe('t1');
    });
  });

  describe('findAll', () => {
    it('should call trackingService.findAll and return array of presenters', () => {
      mockTrackingService.findAll.mockReturnValue([
        { id: 't1', isCompleted: true },
      ]);

      const result = controller.findAll();
      expect(mockTrackingService.findAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(TrackingPresenter);
    });
  });

  describe('findOne', () => {
    it('should call trackingService.findOne and return presenter', () => {
      mockTrackingService.findOne.mockReturnValue({ id: 't1' });

      const result = controller.findOne('t1');
      expect(mockTrackingService.findOne).toHaveBeenCalledWith('t1');
      expect(result.id).toBe('t1');
    });
  });

  describe('update', () => {
    it('should call trackingService.update and return presenter', () => {
      const dto: UpdateTrackingDTO = { isCompleted: false };
      mockTrackingService.update.mockReturnValue({
        id: 't1',
        isCompleted: false,
      });

      const result = controller.update('t1', dto);
      expect(mockTrackingService.update).toHaveBeenCalledWith('t1', dto);
      expect(result.isCompleted).toBe(false);
    });
  });

  describe('remove', () => {
    it('should call trackingService.remove and return presenter', () => {
      mockTrackingService.remove.mockReturnValue({ id: 't1' });

      const result = controller.remove('t1');
      expect(mockTrackingService.remove).toHaveBeenCalledWith('t1');
      expect(result.id).toBe('t1');
    });
  });
});
