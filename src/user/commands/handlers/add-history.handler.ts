import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IUserReadRepository } from '../../../user/interfaces';
import { USER_READ_REPOSITORY } from '../../../user/user.constant';
import { AddHistoryCommand } from '../impl';

@CommandHandler(AddHistoryCommand)
export class AddHistoryHandler implements ICommandHandler<AddHistoryCommand, void> {
  constructor(
    @InjectPinoLogger(AddHistoryHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_READ_REPOSITORY)
    private readonly readRepository: IUserReadRepository,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: AddHistoryCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    this.logger.trace(`END`);
  }
}
