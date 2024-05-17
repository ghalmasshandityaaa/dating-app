import { Inject, Injectable } from '@nestjs/common';
import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY } from '../auth.constant';
import { AuthDomain } from '../domains';
import {
  IUserReadRepository,
  IUserService,
  IUserWriteRepository,
  UserQueryModel,
} from '../interfaces';

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

  async findByIdDomain(id: string): Promise<AuthDomain | undefined> {
    return this.writeRepository.findById(id);
  }
}
