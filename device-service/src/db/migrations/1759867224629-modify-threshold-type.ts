import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyThresholdType1759867224629 implements MigrationInterface {
    name = 'ModifyThresholdType1759867224629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."device_configs_threshold_type_enum" RENAME TO "device_configs_threshold_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_configs_threshold_type_enum" AS ENUM('maximum', 'minimum')`);
        await queryRunner.query(`ALTER TABLE "device_configs" ALTER COLUMN "threshold_type" TYPE "public"."device_configs_threshold_type_enum" USING "threshold_type"::"text"::"public"."device_configs_threshold_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."device_configs_threshold_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."device_configs_threshold_type_enum_old" AS ENUM('MAXIMUM', 'MINIMUM')`);
        await queryRunner.query(`ALTER TABLE "device_configs" ALTER COLUMN "threshold_type" TYPE "public"."device_configs_threshold_type_enum_old" USING "threshold_type"::"text"::"public"."device_configs_threshold_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."device_configs_threshold_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_configs_threshold_type_enum_old" RENAME TO "device_configs_threshold_type_enum"`);
    }

}
