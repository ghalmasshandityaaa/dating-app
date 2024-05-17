import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthDomain } from '../domains';
import { TypeOrmUserEntity } from '../entities';
import { IUserWriteRepository } from '../interfaces';

export class AuthWriteRepository implements IUserWriteRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(entity: AuthDomain): Promise<void> {
    await this.dataSource
      .createEntityManager()
      .insert(TypeOrmUserEntity, { id: entity.id, ...entity.props });
  }
}
