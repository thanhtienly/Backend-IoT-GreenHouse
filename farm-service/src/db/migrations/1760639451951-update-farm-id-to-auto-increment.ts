import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFarmIdToAutoIncrement1760639451951 implements MigrationInterface {
    name = 'UpdateFarmIdToAutoIncrement1760639451951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_on" DROP CONSTRAINT "FK_WorkOn_Farm"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP CONSTRAINT "FK_SensorData_Farm"`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP CONSTRAINT "FK_SensorNotification_Farm"`);
        await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "PK_39aff9c35006b14025bba5a43d9"`);
        await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "farms" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "farms" ADD CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "work_on" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "work_on" ADD "farm_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "farm_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD "farm_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_on" ADD CONSTRAINT "FK_WorkOn_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD CONSTRAINT "FK_SensorData_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD CONSTRAINT "FK_SensorNotification_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP CONSTRAINT "FK_SensorNotification_Farm"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP CONSTRAINT "FK_SensorData_Farm"`);
        await queryRunner.query(`ALTER TABLE "work_on" DROP CONSTRAINT "FK_WorkOn_Farm"`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD "farm_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "farm_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_on" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "work_on" ADD "farm_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "PK_39aff9c35006b14025bba5a43d9"`);
        await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "farms" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "farms" ADD CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD CONSTRAINT "FK_SensorNotification_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD CONSTRAINT "FK_SensorData_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_on" ADD CONSTRAINT "FK_WorkOn_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
