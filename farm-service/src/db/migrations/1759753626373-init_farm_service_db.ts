import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFarmServiceDb1759753626373 implements MigrationInterface {
    name = 'InitFarmServiceDb1759753626373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_on" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "farm_id" uuid NOT NULL, CONSTRAINT "PK_b6d9aa0d5566b123772e4b86d61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sensor_data_sensor_type_enum" AS ENUM('temp', 'humidity', 'light', 'soil_moisture')`);
        await queryRunner.query(`CREATE TABLE "sensor_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sensor_type" "public"."sensor_data_sensor_type_enum" NOT NULL, "value" double precision NOT NULL, "unit" character varying NOT NULL, "collected_at" TIMESTAMP NOT NULL DEFAULT now(), "farm_id" uuid NOT NULL, CONSTRAINT "PK_1c0b5610a1a0f690d40239d408d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sensor_notifications_sensor_type_enum" AS ENUM('temp', 'humidity', 'light', 'soil_moisture')`);
        await queryRunner.query(`CREATE TYPE "public"."sensor_notifications_threshold_type_enum" AS ENUM('MAXIMUM', 'MINIMUM')`);
        await queryRunner.query(`CREATE TABLE "sensor_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sensor_type" "public"."sensor_notifications_sensor_type_enum" NOT NULL, "value" double precision NOT NULL, "unit" character varying NOT NULL, "threshold_type" "public"."sensor_notifications_threshold_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "is_read" boolean NOT NULL, "farm_id" uuid NOT NULL, CONSTRAINT "PK_5014ccd6828b4b72c7bbbf278d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "work_on" ADD CONSTRAINT "FK_WorkOn_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD CONSTRAINT "FK_SensorData_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_notifications" ADD CONSTRAINT "FK_SensorNotification_Farm" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_notifications" DROP CONSTRAINT "FK_SensorNotification_Farm"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP CONSTRAINT "FK_SensorData_Farm"`);
        await queryRunner.query(`ALTER TABLE "work_on" DROP CONSTRAINT "FK_WorkOn_Farm"`);
        await queryRunner.query(`DROP TABLE "sensor_notifications"`);
        await queryRunner.query(`DROP TYPE "public"."sensor_notifications_threshold_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."sensor_notifications_sensor_type_enum"`);
        await queryRunner.query(`DROP TABLE "sensor_data"`);
        await queryRunner.query(`DROP TYPE "public"."sensor_data_sensor_type_enum"`);
        await queryRunner.query(`DROP TABLE "work_on"`);
        await queryRunner.query(`DROP TABLE "farms"`);
    }

}
