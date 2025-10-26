import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceModeToDeviceTable1759911980100 implements MigrationInterface {
    name = 'AddDeviceModeToDeviceTable1759911980100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."devices_mode_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "mode" "public"."devices_mode_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "mode"`);
        await queryRunner.query(`DROP TYPE "public"."devices_mode_enum"`);
    }

}
