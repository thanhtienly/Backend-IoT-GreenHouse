import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDeviceDb1759826616206 implements MigrationInterface {
    name = 'InitDeviceDb1759826616206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."devices_type_enum" AS ENUM('pump', 'led', 'fan')`);
        await queryRunner.query(`CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "feed_name" character varying NOT NULL, "type" "public"."devices_type_enum" NOT NULL, "farm_id" uuid NOT NULL, CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."device_configs_threshold_type_enum" AS ENUM('MAXIMUM', 'MINIMUM')`);
        await queryRunner.query(`CREATE TYPE "public"."device_configs_sensor_type_enum" AS ENUM('temp', 'humidity', 'light', 'soil_moisture')`);
        await queryRunner.query(`CREATE TYPE "public"."device_configs_device_mode_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`CREATE TABLE "device_configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" double precision NOT NULL, "threshold_type" "public"."device_configs_threshold_type_enum" NOT NULL, "sensor_type" "public"."device_configs_sensor_type_enum" NOT NULL, "device_mode" "public"."device_configs_device_mode_enum" NOT NULL, "device_id" uuid NOT NULL, CONSTRAINT "PK_182c4584030e2abaa0862a8d881" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."device_schedules_day_of_week_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "device_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day_of_week" "public"."device_schedules_day_of_week_enum" NOT NULL, "start_hour" integer NOT NULL, "start_minute" integer NOT NULL, "duration" integer NOT NULL, "device_id" uuid NOT NULL, CONSTRAINT "PK_5018bb380a7ef8c37d692c4b0e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."device_history_device_mode_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`CREATE TABLE "device_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_mode" "public"."device_history_device_mode_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "device_id" uuid NOT NULL, CONSTRAINT "PK_e7b12f40c596560b264d9cd68f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "device_configs" ADD CONSTRAINT "FK_DeviceConfig_Device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_schedules" ADD CONSTRAINT "FK_DeviceConfig_Device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_history" ADD CONSTRAINT "FK_DeviceConfig_Device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_history" DROP CONSTRAINT "FK_DeviceConfig_Device"`);
        await queryRunner.query(`ALTER TABLE "device_schedules" DROP CONSTRAINT "FK_DeviceConfig_Device"`);
        await queryRunner.query(`ALTER TABLE "device_configs" DROP CONSTRAINT "FK_DeviceConfig_Device"`);
        await queryRunner.query(`DROP TABLE "device_history"`);
        await queryRunner.query(`DROP TYPE "public"."device_history_device_mode_enum"`);
        await queryRunner.query(`DROP TABLE "device_schedules"`);
        await queryRunner.query(`DROP TYPE "public"."device_schedules_day_of_week_enum"`);
        await queryRunner.query(`DROP TABLE "device_configs"`);
        await queryRunner.query(`DROP TYPE "public"."device_configs_device_mode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."device_configs_sensor_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."device_configs_threshold_type_enum"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TYPE "public"."devices_type_enum"`);
    }

}
