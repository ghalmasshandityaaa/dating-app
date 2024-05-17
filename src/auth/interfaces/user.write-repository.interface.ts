import { Package } from '../../common/interfaces';
import { AuthDomain } from '../domains';

export interface IUserWriteRepository {
  findById(id: string): Promise<AuthDomain | undefined>;
  create(entity: AuthDomain): Promise<void>;
  updatePackage(id: string, pkg: Package): Promise<void>;
}
