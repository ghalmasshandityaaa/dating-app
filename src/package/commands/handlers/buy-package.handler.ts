import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Package } from '../../../common/interfaces';
import { UserPackageAggregate } from '../../../package/domains';
import { PackageError } from '../../../package/errors';
import { IUserPackageWriteRepository } from '../../../package/interfaces';
import { USER_PACKAGE_WRITE_REPOSITORY } from '../../../package/package.constant';
import { BuyPackageCommand } from '../impl';

@CommandHandler(BuyPackageCommand)
export class BuyPackageHandler implements ICommandHandler<BuyPackageCommand, void> {
  constructor(
    @InjectPinoLogger(BuyPackageHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_PACKAGE_WRITE_REPOSITORY)
    private readonly repository: IUserPackageWriteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: BuyPackageCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    if (command.identity.package !== Package.STANDARD) {
      this.logger.warn('cannot buy, already bought');
      throw new PackageError.AlreadyBought();
    }

    const userPackage = this.publisher.mergeObjectContext(
      UserPackageAggregate.create({
        userId: command.identity.id,
        package: command.package,
      }),
    );

    await this.repository.create(userPackage);

    // fire the event
    userPackage.commit();

    this.logger.trace(`END`);
  }
}
