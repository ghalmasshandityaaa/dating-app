import { ICommand } from '@nestjs/cqrs';
import { DatingHistoryType } from '../../../user/user.constant';

class Props {
  readonly userId: string;
  readonly partnerId: string;
  readonly type: DatingHistoryType;
}

export class AddHistoryCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
