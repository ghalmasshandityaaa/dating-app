import { faker } from '@faker-js/faker';
import { Package } from '../../../common/interfaces';
import { UserPackageAggregate } from '../../../package/domains';
import { PackageError } from '../../../package/errors';
import { BuyPackageCommand } from '../impl';
import { BuyPackageHandler } from './buy-package.handler';

const loggerMock = {
  trace: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

const writeRepositoryMock = {
  create: jest.fn(),
};

const publisherMock = {
  mergeObjectContext: jest.fn(),
};

const userPackageMock = {
  commit: jest.fn(),
};

describe('BuyPackageHandler', () => {
  let buyPackageHandler: BuyPackageHandler;

  beforeEach(() => {
    buyPackageHandler = new BuyPackageHandler(
      loggerMock as any,
      writeRepositoryMock as any,
      publisherMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error given package already bought', async () => {
    // Arrange
    const command: BuyPackageCommand = new BuyPackageCommand({
      identity: {
        id: faker.string.uuid(),
        package: Package.VERIFIED,
      },
      package: Package.VERIFIED,
    });

    // Act
    const createSpy = jest.spyOn(writeRepositoryMock, 'create');
    const mergeSpy = jest.spyOn(publisherMock, 'mergeObjectContext');
    const userPackageSpy = jest.spyOn(userPackageMock, 'commit');
    const execute = buyPackageHandler.execute(command);

    // Assert
    await expect(execute).rejects.toBeInstanceOf(PackageError.AlreadyBought);
    expect(createSpy).not.toHaveBeenCalled();
    expect(mergeSpy).not.toHaveBeenCalled();
    expect(userPackageSpy).not.toHaveBeenCalled();
  });

  it('should work', async () => {
    // Arrange
    const command: BuyPackageCommand = new BuyPackageCommand({
      identity: {
        id: faker.string.uuid(),
        package: Package.STANDARD,
      },
      package: Package.VERIFIED,
    });

    jest.spyOn(UserPackageAggregate, 'create').mockReturnValue(userPackageMock as any);
    jest.spyOn(publisherMock, 'mergeObjectContext').mockReturnValue(userPackageMock);

    // Act
    const createSpy = jest.spyOn(writeRepositoryMock, 'create');
    const mergeSpy = jest.spyOn(publisherMock, 'mergeObjectContext');
    const userPackageSpy = jest.spyOn(userPackageMock, 'commit');
    const execute = buyPackageHandler.execute(command);

    // Assert
    await expect(execute).resolves.not.toThrow();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(mergeSpy).toHaveBeenCalledTimes(1);
    expect(userPackageSpy).toHaveBeenCalledTimes(1);
  });
});
