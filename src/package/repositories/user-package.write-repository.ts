import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../../auth/entities';
import { UserPackageAggregate } from '../domains';
import { IUserPackageWriteRepository } from '../interfaces';

export class UserPackageWriteRepository implements IUserPackageWriteRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(entity: UserPackageAggregate): Promise<void> {
    await this.dataSource
      .createEntityManager()
      .insert(TypeOrmUserEntity, { id: entity.id, ...entity.props });
  }
}
