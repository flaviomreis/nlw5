import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateConnection1619098832089 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'connection',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true
          },
          {
            name: 'user_id',
            type: 'uuid'
          },
          {
            name: 'admin_id',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'socket_id',
            type: 'varchar'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'connection',
      new TableForeignKey(
        {
          name: 'FKConnectionUser',
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          columnNames: ['user_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      )
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('connection', 'FKConnectionUser');
    await queryRunner.dropTable('connection');
  }

}
