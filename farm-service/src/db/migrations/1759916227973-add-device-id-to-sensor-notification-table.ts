import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceIdToSensorNotificationTable1759916227973 implements MigrationInterface {
    name = 'AddDeviceIdToSensorNotificationTable1759916227973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD "device_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."sensor_notifications_device_trigger_mode_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD "device_trigger_mode" "public"."sensor_notifications_device_trigger_mode_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP COLUMN "device_trigger_mode"`);
        await queryRunner.query(`DROP TYPE "public"."sensor_notifications_device_trigger_mode_enum"`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP COLUMN "device_id"`);
    }

}
