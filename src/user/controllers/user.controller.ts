import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Identity } from '../../common/decorators';
import { IIdentity } from '../../common/interfaces';
import { AddHistoryCommand } from '../commands';
import { BaseIdParamDto } from '../dtos';
import { DatingHistoryType } from '../user.constant';

@Controller({
  path: 'users',
})
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Post(':id/like')
  async register(@Identity() identity: IIdentity, @Param() param: BaseIdParamDto) {
    const command = new AddHistoryCommand({
      userId: identity.id,
      partnerId: param.id,
      type: DatingHistoryType.LIKE,
    });
    return await this.commandBus.execute(command);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/pass')
  async login(@Identity() identity: IIdentity, @Param() param: BaseIdParamDto) {
    const command = new AddHistoryCommand({
      userId: identity.id,
      partnerId: param.id,
      type: DatingHistoryType.PASS,
    });
    return await this.commandBus.execute(command);
  }
}
