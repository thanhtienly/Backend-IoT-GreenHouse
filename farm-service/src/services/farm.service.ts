import { Injectable } from '@nestjs/common';
import { Farm, WorkOn } from 'src/entity/farm.entity';
import { SensorData, SensorNotification } from 'src/entity/sensor.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FarmService {
  private farmRepository: Repository<Farm>;
  private workOnRepository: Repository<WorkOn>;

  constructor(private dataSource: DataSource) {
    this.farmRepository = this.dataSource.getRepository(Farm);
    this.workOnRepository = this.dataSource.getRepository(WorkOn);
  }

  async getUserWorkOnFarm(farmId: number): Promise<WorkOn[]> {
    return await this.workOnRepository.find({
      where: {
        farmId: farmId,
      },
    });
  }
}
