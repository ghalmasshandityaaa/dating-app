import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DatingHistoryError } from '../../../user/errors';
import { IDatingHistoryWriteRepository } from '../../../user/interfaces';
import { DATING_HISTORY_WRITE_REPOSITORY } from '../../../user/user.constant';
import { AddHistoryCommand } from '../impl';

@CommandHandler(AddHistoryCommand)
export class AddHistoryHandler implements ICommandHandler<AddHistoryCommand, void> {
  constructor(
    @InjectPinoLogger(AddHistoryHandler.name)
    private readonly logger: PinoLogger,
    @Inject(DATING_HISTORY_WRITE_REPOSITORY)
    private readonly writeRepository: IDatingHistoryWriteRepository,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: AddHistoryCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    if (command.userId === command.partnerId) {
      throw new DatingHistoryError.MatchOwnUser();
    }

    const exist = await this.writeRepository.todayExist(command.userId, command.partnerId);
    if (exist) throw new DatingHistoryError.CannotTwice();

    await this.writeRepository.create(command.userId, command.partnerId, command.type);

    this.logger.trace(`END`);
  }
}
