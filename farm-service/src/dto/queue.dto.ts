import {
  DeviceMode,
  SensorType,
  ThresholdType,
} from 'src/entity/sensor.entity';

export class RawSensorDataDTO {
  sensorType: SensorType;
  farmId: number;
  value: number;
}

export class SensorNotificationDTO {
  farmId: number;
  sensorType: SensorType;
  value: number;
  deviceId: string;
  deviceTriggerMode: DeviceMode;
  thresholdType: ThresholdType;
  isRead: boolean;
}

export class SensorNotificationByEmailDTO extends SensorNotificationDTO {
  receiver: string[];
}
