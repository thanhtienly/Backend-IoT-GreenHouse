import { Injectable } from '@nestjs/common';
import { SensorData, SensorNotification } from 'src/entity/sensor.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SensorService {
  private sensorDataRepository: Repository<SensorData>;
  private sensorNotificationRepository: Repository<SensorNotification>;

  constructor(private dataSource: DataSource) {
    this.sensorDataRepository = this.dataSource.getRepository(SensorData);
    this.sensorNotificationRepository =
      this.dataSource.getRepository(SensorNotification);
  }

  async createSensorData(sensorData: SensorData): Promise<SensorData> {
    var newSensorData = this.sensorDataRepository.create(sensorData);
    return this.sensorDataRepository.save(newSensorData);
  }

  async createSensorNotification(
    sensorNotification: SensorNotification,
  ): Promise<SensorNotification> {
    var newSensorNotification =
      this.sensorNotificationRepository.create(sensorNotification);
    return this.sensorNotificationRepository.save(newSensorNotification);
  }
}
