import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  TOKEN_SERVICE,
  USER_READ_REPOSITORY,
  USER_WRITE_REPOSITORY,
} from '../../../auth/auth.constant';
import { AuthDomain } from '../../../auth/domains';
import { AuthError } from '../../../auth/errors';
import { ITokenService, IUserReadRepository, IUserWriteRepository } from '../../../auth/interfaces';
import { RegisterCommand } from '../impl';
import { RegisterResult } from '../results/register.result';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, RegisterResult> {
  constructor(
    @InjectPinoLogger(RegisterHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_READ_REPOSITORY)
    private readonly readRepository: IUserReadRepository,
    @Inject(USER_WRITE_REPOSITORY)
    private readonly writeRepository: IUserWriteRepository,
    @Inject(TOKEN_SERVICE)
    private readonly service: ITokenService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: RegisterCommand): Promise<RegisterResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const user = await this.readRepository.findByUsername(command.username);
    if (user) {
      throw new AuthError.UsernameTaken();
    }

    const auth = AuthDomain.create(command);
    await this.writeRepository.create(auth);

    const [accessToken, refreshToken] = await Promise.all([
      this.service.generateAccessToken({ id: auth.id, package: auth.props.package }),
      this.service.generateRefreshToken({ id: auth.id, package: auth.props.package }),
    ]);

    const result = new RegisterResult(accessToken, refreshToken);

    this.logger.trace(`END`);
    return result;
  }
}
