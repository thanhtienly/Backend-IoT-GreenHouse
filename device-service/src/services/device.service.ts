import { Injectable } from '@nestjs/common';
import {
  Device,
  DeviceConfig,
  DeviceHistory,
  DeviceMode,
  SensorType,
} from 'src/entity/device.entity';
import { DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  private deviceRepository: Repository<Device>;
  private deviceConfigRepository: Repository<DeviceConfig>;
  private deviceHistoryRepository: Repository<DeviceHistory>;

  constructor(private dataSource: DataSource) {
    this.deviceConfigRepository = this.dataSource.getRepository(DeviceConfig);
    this.deviceRepository = this.dataSource.getRepository(Device);
    this.deviceHistoryRepository = this.dataSource.getRepository(DeviceHistory);
  }

  async findAllDevices() {
    return await this.deviceRepository.find();
  }

  async findDeviceConfigBySensorType(
    sensorType: SensorType,
  ): Promise<DeviceConfig[] | null> {
    return await this.deviceConfigRepository.find({
      where: {
        sensorType: sensorType,
      },
    });
  }

  async findDeviceByIdAndOppositeMode(
    deviceId: string,
    deviceMode: DeviceMode,
  ): Promise<Device | null> {
    return await this.deviceRepository.findOne({
      where: {
        id: deviceId,
        mode: Not(deviceMode),
      },
    });
  }

  async updateDeviceMode(
    deviceId: string,
    newMode: DeviceMode,
  ): Promise<Device | null> {
    var deviceToUpdate = await this.deviceRepository.findOne({
      where: {
        id: deviceId,
      },
    });

    if (deviceToUpdate) {
      deviceToUpdate.mode = newMode;
      return await this.deviceRepository.save(deviceToUpdate);
    }

    return deviceToUpdate;
  }

  async createDeviceHistory(
    deviceHistory: DeviceHistory,
  ): Promise<DeviceHistory> {
    var newDeviceHistory = this.deviceHistoryRepository.create(deviceHistory);
    return this.deviceHistoryRepository.save(newDeviceHistory);
  }
}
