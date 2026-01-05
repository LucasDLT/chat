import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleAuthToUser1767588129085 implements MigrationInterface {
    name = 'AddGoogleAuthToUser1767588129085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "google_id" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_id"`);
    }

}
