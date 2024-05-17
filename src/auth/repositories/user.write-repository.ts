import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Package } from '../../common/interfaces';
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

  async findById(id: string): Promise<AuthDomain | undefined> {
    const user = await this.dataSource
      .createQueryBuilder(TypeOrmUserEntity, 'user')
      .where('user.id = :id', { id })
      .getOne();

    return user ? AuthDomain.rebuild({ ...user }, user.id) : undefined;
  }

  async updatePackage(id: string, pkg: Package): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(TypeOrmUserEntity)
      .set({ package: pkg, updatedAt: new Date() })
      .where('id = :id', { id })
      .execute();
  }
}
