import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { TOKEN_SERVICE, USER_READ_REPOSITORY } from '../../../auth/auth.constant';
import { AuthError } from '../../../auth/errors';
import { ITokenService, IUserReadRepository } from '../../../auth/interfaces';
import { StringUtils } from '../../../common/utils';
import { LoginCommand } from '../impl';
import { LoginResult } from '../results';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
  constructor(
    @InjectPinoLogger(LoginHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_READ_REPOSITORY)
    private readonly readRepository: IUserReadRepository,
    @Inject(TOKEN_SERVICE)
    private readonly service: ITokenService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: LoginCommand): Promise<LoginResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const user = await this.readRepository.findByUsername(command.username);
    if (!user) throw new AuthError.UserNotFound();

    const match = await StringUtils.compare(user.password, command.password);
    if (!match) throw new AuthError.InvalidCredentials();

    const [accessToken, refreshToken] = await Promise.all([
      this.service.generateAccessToken({ ...user }),
      this.service.generateRefreshToken({ ...user }),
    ]);

    const result = new LoginResult(accessToken, refreshToken);

    this.logger.trace(`END`);
    return result;
  }
}
