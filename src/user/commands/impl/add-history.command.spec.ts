import { faker } from '@faker-js/faker';
import { DatingHistoryType } from '../../../user/user.constant';
import { AddHistoryCommand } from './add-history.command';

describe('AddHistoryCommand', () => {
  it('should create a new AddHistoryCommand instance', () => {
    // Arrange
    const props = {
      userId: faker.string.uuid(),
      partnerId: faker.string.uuid(),
      type: faker.helpers.arrayElement([DatingHistoryType.LIKE, DatingHistoryType.PASS]),
    };

    // Act
    const command = new AddHistoryCommand(props);

    // Assert
    expect(command).toBeInstanceOf(AddHistoryCommand);
    expect(command.userId).toBe(props.userId);
    expect(command.partnerId).toBe(props.partnerId);
    expect(command.type).toBe(props.type);
  });
});
