import { AuthDomain } from '../domains';

export interface IUserWriteRepository {
  create(entity: AuthDomain): Promise<void>;
}
