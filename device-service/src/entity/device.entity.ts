import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum DeviceType {
  PUMP = 'pump',
  LED = 'led',
  FAN = 'fan',
}

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

export enum DayOfWeek {
  SUN = 0,
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6,
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    name: 'feed_name',
  })
  feedName: string;

  @Column({
    type: 'enum',
    enum: DeviceMode,
  })
  mode: DeviceMode;

  @Column({
    type: 'enum',
    enum: DeviceType,
  })
  type: DeviceType;

  @Column({
    name: 'farm_id',
    type: 'integer',
  })
  farmId: number;
}

@Entity('device_configs')
export class DeviceConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'float',
  })
  value: number;

  @Column({
    name: 'threshold_type',
    type: 'enum',
    enum: ThresholdType,
  })
  thresholdType: ThresholdType;

  @Column({
    name: 'sensor_type',
    type: 'enum',
    enum: SensorType,
  })
  sensorType: SensorType;

  @Column({
    name: 'device_mode',
    type: 'enum',
    enum: DeviceMode,
  })
  deviceMode: DeviceMode;

  @Column({
    name: 'device_id',
    type: 'uuid',
  })
  deviceId: string;

  @ManyToOne(() => Device, (device) => device.id)
  @JoinColumn({
    name: 'device_id',
    foreignKeyConstraintName: 'FK_DeviceConfig_Device',
  })
  device: Device;
}

@Entity('device_schedules')
export class DeviceSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({
    name: 'start_hour',
    type: 'int',
  })
  startHour: number;

  @Column({
    name: 'start_minute',
    type: 'int',
  })
  startMinute: number;

  @Column({
    type: 'int',
  })
  duration: number;

  @Column({
    name: 'device_id',
    type: 'uuid',
  })
  deviceId: string;

  @ManyToOne(() => Device, (device) => device.id)
  @JoinColumn({
    name: 'device_id',
    foreignKeyConstraintName: 'FK_DeviceConfig_Device',
  })
  device: Device;
}

@Entity('device_history')
export class DeviceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'device_mode',
    type: 'enum',
    enum: DeviceMode,
  })
  deviceMode: DeviceMode;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  createdAt: Date;

  @Column({
    name: 'device_id',
    type: 'uuid',
  })
  deviceId: string;

  @ManyToOne(() => Device, (device) => device.id)
  @JoinColumn({
    name: 'device_id',
    foreignKeyConstraintName: 'FK_DeviceConfig_Device',
  })
  device: Device;
}
