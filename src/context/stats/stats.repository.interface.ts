import { StatEntity } from './entities/stats.entity';

export abstract class StatsRepositoryInterface {
  abstract create(stat: StatEntity): Promise<StatEntity>;
  abstract findAllByUserId(userId: string): Promise<StatEntity[]>;
  abstract findOne(id: string): Promise<StatEntity | null>;
  abstract update(stat: StatEntity): Promise<StatEntity>;
  abstract remove(stat: StatEntity): Promise<StatEntity>;
}
