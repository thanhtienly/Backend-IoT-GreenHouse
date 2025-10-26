import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUnitOfSensorData1759835899138 implements MigrationInterface {
    name = 'RemoveUnitOfSensorData1759835899138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP COLUMN "unit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD "unit" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "unit" character varying NOT NULL`);
    }

}
