import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../entities';
import { IUserReadRepository, UserQueryModel } from '../interfaces';

export class UserReadRepository implements IUserReadRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<UserQueryModel | undefined> {
    const user = await this.dataSource
      .createQueryBuilder(TypeOrmUserEntity, 'user')
      .where('user.id = :id', { id })
      .getOne();

    return user || undefined;
  }

  async findByUsername(username: string): Promise<UserQueryModel | undefined> {
    const user = await this.dataSource
      .createQueryBuilder(TypeOrmUserEntity, 'user')
      .where('user.username = :username', { username })
      .getOne();

    return user || undefined;
  }
}
