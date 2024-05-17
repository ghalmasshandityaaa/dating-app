import { hashSync } from 'bcrypt';
import { Entity } from '../../common/domains';
import { Package } from '../../common/interfaces';

type Props = {
  profile: string;
  fullName: string;
  username: string;
  password: string;
  package: Package;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProps = Omit<Props, 'createdAt' | 'updatedAt' | 'package'>;

/**
 *
 */
export class AuthDomain extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateProps): AuthDomain {
    const entity = new AuthDomain({
      ...props,
      password: hashSync(props.password, 10),
      package: Package.STANDARD,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return entity;
  }

  /**
   *
   * @param props
   * @param id
   * @returns
   */
  public static rebuild(props: Props, id: string): AuthDomain {
    return new AuthDomain(props, id);
  }
}
