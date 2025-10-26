import { MigrationInterface, QueryRunner } from "typeorm";

export class LowercaseThresholdType1759950487394 implements MigrationInterface {
    name = 'LowercaseThresholdType1759950487394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."sensor_notifications_threshold_type_enum" RENAME TO "sensor_notifications_threshold_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."sensor_notifications_threshold_type_enum" AS ENUM('maximum', 'minimum')`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ALTER COLUMN "threshold_type" TYPE "public"."sensor_notifications_threshold_type_enum" USING "threshold_type"::"text"::"public"."sensor_notifications_threshold_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."sensor_notifications_threshold_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sensor_notifications_threshold_type_enum_old" AS ENUM('MAXIMUM', 'MINIMUM')`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ALTER COLUMN "threshold_type" TYPE "public"."sensor_notifications_threshold_type_enum_old" USING "threshold_type"::"text"::"public"."sensor_notifications_threshold_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."sensor_notifications_threshold_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."sensor_notifications_threshold_type_enum_old" RENAME TO "sensor_notifications_threshold_type_enum"`);
    }

}
