import { faker } from '@faker-js/faker';
import { Package } from '../../../common/interfaces';
import { BuyPackageCommand } from './buy-package.command';

describe('BuyPackageCommand', () => {
  it('should create a new BuyPackageCommand instance', () => {
    // Arrange
    const props = {
      identity: {
        id: faker.string.uuid(),
        package: Package.STANDARD,
      },
      package: Package.STANDARD,
    };

    // Act
    const command = new BuyPackageCommand(props);

    // Assert
    expect(command).toBeInstanceOf(BuyPackageCommand);
    expect(command.identity).toBe(props.identity);
    expect(command.package).toBe(props.package);
  });
});
