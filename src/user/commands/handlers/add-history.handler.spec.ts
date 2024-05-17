import { faker } from '@faker-js/faker';
import { DatingHistoryError } from '../../errors';
import { DatingHistoryType } from '../../user.constant';
import { AddHistoryCommand } from '../impl';
import { AddHistoryHandler } from './add-history.handler';

const loggerMock = {
  trace: jest.fn(),
  info: jest.fn(),
};

const repositoryMock = {
  todayExist: jest.fn(),
  create: jest.fn(),
};

describe('AddHistoryHandler', () => {
  let addHistoryHandler: AddHistoryHandler;

  beforeEach(() => {
    addHistoryHandler = new AddHistoryHandler(loggerMock as any, repositoryMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error given partnerId is same as userId', async () => {
    // Arrange
    const id = faker.string.uuid();
    const command: AddHistoryCommand = new AddHistoryCommand({
      userId: id,
      partnerId: id,
      type: faker.helpers.arrayElement([DatingHistoryType.LIKE, DatingHistoryType.PASS]),
    });

    // Act
    const todayExistSpy = jest.spyOn(repositoryMock, 'todayExist');
    const createSpy = jest.spyOn(repositoryMock, 'create');
    const execute = addHistoryHandler.execute(command);

    // Assert
    await expect(execute).rejects.toBeInstanceOf(DatingHistoryError.MatchOwnUser);
    expect(todayExistSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should throw an error given like or pass is same as today', async () => {
    // Arrange
    const command: AddHistoryCommand = new AddHistoryCommand({
      userId: faker.string.uuid(),
      partnerId: faker.string.uuid(),
      type: faker.helpers.arrayElement([DatingHistoryType.LIKE, DatingHistoryType.PASS]),
    });

    // Act
    const todayExistSpy = jest.spyOn(repositoryMock, 'todayExist').mockResolvedValueOnce(true);
    const createSpy = jest.spyOn(repositoryMock, 'create');
    const execute = addHistoryHandler.execute(command);

    // Assert
    await expect(execute).rejects.toBeInstanceOf(DatingHistoryError.CannotTwice);
    expect(todayExistSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should work', async () => {
    // Arrange
    const command: AddHistoryCommand = new AddHistoryCommand({
      userId: faker.string.uuid(),
      partnerId: faker.string.uuid(),
      type: faker.helpers.arrayElement([DatingHistoryType.LIKE, DatingHistoryType.PASS]),
    });

    // Act
    const todayExistSpy = jest.spyOn(repositoryMock, 'todayExist').mockResolvedValueOnce(false);
    const createSpy = jest.spyOn(repositoryMock, 'create');
    const execute = addHistoryHandler.execute(command);

    // Assert
    await expect(execute).resolves.not.toThrow();
    expect(todayExistSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});
