import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFarmIdToAutoIncrement1760640106383 implements MigrationInterface {
    name = 'UpdateFarmIdToAutoIncrement1760640106383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "farm_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "farm_id" uuid NOT NULL`);
    }

}
