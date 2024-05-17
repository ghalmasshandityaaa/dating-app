import { Inject, Injectable } from '@nestjs/common';
import { USER_READ_REPOSITORY } from '../auth.constant';
import { IUserReadRepository, IUserService, UserQueryModel } from '../interfaces';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly readRepository: IUserReadRepository,
  ) {}

  async findById(id: string): Promise<UserQueryModel | undefined> {
    return this.readRepository.findById(id);
  }
}
