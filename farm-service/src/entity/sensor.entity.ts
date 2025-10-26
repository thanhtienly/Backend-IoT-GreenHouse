import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';

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

@Entity('sensor_data')
export class SensorData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'sensor_type',
    type: 'enum',
    enum: SensorType,
  })
  sensorType: SensorType;

  @Column({
    type: 'float',
  })
  value: number;

  @Column({
    name: 'collected_at',
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  collectedAt: Date;

  @Column({
    name: 'farm_id',
    type: 'integer',
  })
  farmId: number;

  @ManyToOne(() => Farm, (farm) => farm.id)
  @JoinColumn({
    name: 'farm_id',
    foreignKeyConstraintName: 'FK_SensorData_Farm',
  })
  farm: Farm;
}

@Entity('sensor_notifications')
export class SensorNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'sensor_type',
    type: 'enum',
    enum: SensorType,
  })
  sensorType: SensorType;

  @Column({
    type: 'float',
  })
  value: number;

  @Column({
    name: 'device_id',
    type: 'uuid',
  })
  deviceId: string;

  @Column({
    name: 'device_trigger_mode',
    type: 'enum',
    enum: DeviceMode,
  })
  deviceTriggerMode: DeviceMode;

  @Column({
    name: 'threshold_type',
    type: 'enum',
    enum: ThresholdType,
  })
  thresholdType: ThresholdType;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  createdAt: Date;

  @Column({
    name: 'is_read',
    type: 'boolean',
  })
  isRead: boolean;

  @Column({
    name: 'farm_id',
    type: 'integer',
  })
  farmId: number;

  @ManyToOne(() => Farm, (farm) => farm.id)
  @JoinColumn({
    name: 'farm_id',
    foreignKeyConstraintName: 'FK_SensorNotification_Farm',
  })
  farm: Farm;
}
