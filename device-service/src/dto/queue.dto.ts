import {
  DeviceMode,
  DeviceType,
  SensorType,
  ThresholdType,
} from '../entity/device.entity';

export class SensorDataDTO {
  id: string;
  farmId: number;
  value: number;
  sensorType: SensorType;
  collectedAt: string;
}

export class SensorNotificationDTO {
  farmId: number;
  sensorType: SensorType;
  value: number;
  deviceId: string;
  deviceTriggerMode: DeviceMode;
  deviceName: string;
  thresholdType: ThresholdType;
  isRead: boolean;
}

export class PendingActionDeviceDTO {
  id: string;
  name: string;
  description: string;
  feedName: string;
  mode: DeviceMode;
  type: DeviceType;
  farmId: number;
  newMode: DeviceMode;
}

export class DeviceModeUpdateDTO {
  deviceId: string;
  deviceMode: DeviceMode;
  createdAt: Date;
}
