import { faker } from '@faker-js/faker';
import { AuthError } from '../../errors';
import { RegisterCommand } from '../impl';
import { RegisterResult } from '../results/register.result';
import { RegisterHandler } from './register.handler';

const loggerMock = {
  trace: jest.fn(),
  info: jest.fn(),
};

const readRepositoryMock = {
  findByUsername: jest.fn(),
};

const writeRepositoryMock = {
  create: jest.fn(),
};

const serviceMock = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
};

describe('RegisterHandler', () => {
  let registerHandler: RegisterHandler;

  beforeEach(() => {
    registerHandler = new RegisterHandler(
      loggerMock as any,
      readRepositoryMock as any,
      writeRepositoryMock as any,
      serviceMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user when email and username are unique', async () => {
    // Arrange
    const command: RegisterCommand = new RegisterCommand({
      profile: faker.internet.url(),
      fullName: faker.person.fullName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    // Act
    const findByUsernameSpy = jest
      .spyOn(readRepositoryMock, 'findByUsername')
      .mockResolvedValueOnce(null);
    const createSpy = jest.spyOn(writeRepositoryMock, 'create');
    const generateAccessTokenSpy = jest.spyOn(serviceMock, 'generateAccessToken');
    const generateRefreshTokenSpy = jest.spyOn(serviceMock, 'generateRefreshToken');
    const execute = registerHandler.execute(command);

    // Assert
    await expect(execute).resolves.toBeInstanceOf(RegisterResult);
    expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(generateAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(generateRefreshTokenSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if username is already taken', async () => {
    // Arrange
    const command: RegisterCommand = new RegisterCommand({
      profile: faker.internet.url(),
      fullName: faker.person.fullName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    // Act
    const findByUsernameSpy = jest
      .spyOn(readRepositoryMock, 'findByUsername')
      .mockResolvedValueOnce({});
    const createSpy = jest.spyOn(writeRepositoryMock, 'create');
    const generateAccessTokenSpy = jest.spyOn(serviceMock, 'generateAccessToken');
    const generateRefreshTokenSpy = jest.spyOn(serviceMock, 'generateRefreshToken');
    const execute = registerHandler.execute(command);

    // Assert
    await expect(execute).rejects.toBeInstanceOf(AuthError.UsernameTaken);
    expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).not.toHaveBeenCalled();
    expect(generateAccessTokenSpy).not.toHaveBeenCalled();
    expect(generateRefreshTokenSpy).not.toHaveBeenCalled();
  });
});
