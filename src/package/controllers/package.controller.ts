import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Identity } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import { IIdentity } from '../../common/interfaces';
import { BuyPackageCommand } from '../commands';
import { BuyPackageBodyDto } from '../dtos';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'packages',
})
export class PackageController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Post('buy')
  async buy(@Identity() identity: IIdentity, @Body() body: BuyPackageBodyDto) {
    const command = new BuyPackageCommand({
      identity,
      package: body.package,
    });
    return await this.commandBus.execute(command);
  }
}
