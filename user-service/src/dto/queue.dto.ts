export enum SensorType {
  TEMPERATURE = 'temp',
  HUMIDITY = 'humidity',
  LIGHT = 'light',
  SOIL_MOISTURE = 'soil_moisture',
}

export enum ThresholdType {
  MAX = 'maximum',
  MIN = 'minimum',
}

export enum DeviceMode {
  ON = 1,
  OFF = 0,
}

export class SensorNotificationByEmailDTO {
  farmId: number;
  sensorType: SensorType;
  value: number;
  deviceId: string;
  deviceTriggerMode: DeviceMode;
  deviceName: string;
  thresholdType: ThresholdType;
  isRead: boolean;
  receiver: string[];
}

export class EmailPendingDTO {
  email: string;
  subject: string;
  body: string;
}
