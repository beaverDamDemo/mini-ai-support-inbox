import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMessagesTable1791920000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'customerMessage', type: 'text' },
          { name: 'category', type: 'character varying', isNullable: true },
          { name: 'generatedReply', type: 'text', isNullable: true },
          { name: 'approved', type: 'boolean', default: false },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('messages');
  }
}