import { Inject, Injectable } from '@nestjs/common';
import { UserDomain } from '../domains';
import {
  IUserReadRepository,
  IUserService,
  IUserWriteRepository,
  UserQueryModel,
} from '../interfaces';
import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY } from '../user.constant';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly readRepository: IUserReadRepository,
    @Inject(USER_WRITE_REPOSITORY)
    private readonly writeRepository: IUserWriteRepository,
  ) {}

  async findById(id: string): Promise<UserQueryModel | undefined> {
    return this.readRepository.findById(id);
  }

  async findByIdDomain(id: string): Promise<UserDomain | undefined> {
    return this.writeRepository.findById(id);
  }

  async findByUsername(username: string): Promise<UserQueryModel | undefined> {
    return this.readRepository.findByUsername(username);
  }

  async create(user: UserDomain): Promise<void> {
    await this.writeRepository.create(user);
  }
}
