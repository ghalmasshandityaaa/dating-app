import { ICommand } from '@nestjs/cqrs';
import { IIdentity, Package } from '../../../common/interfaces';

class Props {
  readonly identity: IIdentity;
  readonly package: Package;
}

export class BuyPackageCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
