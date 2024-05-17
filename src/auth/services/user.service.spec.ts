import { faker } from '@faker-js/faker';
import { UserService } from './user.service';

const repositoryMock = {
  findById: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(repositoryMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should work given undefined', async () => {
    // Arrange
    const id = faker.string.uuid();

    // Act
    const findByIdSpy = jest.spyOn(repositoryMock, 'findById').mockResolvedValueOnce(undefined);
    const accessToken = await userService.findById(id);

    // Assert
    expect(accessToken).toBe(undefined);
    expect(findByIdSpy).toHaveBeenCalledWith(id);
  });

  it('should work', async () => {
    // Arrange
    const id = faker.string.uuid();
    const dummy = stub();

    // Act
    const findByIdSpy = jest.spyOn(repositoryMock, 'findById').mockResolvedValueOnce(dummy);
    const accessToken = await userService.findById(id);

    // Assert
    expect(accessToken).toBe(dummy);
    expect(findByIdSpy).toHaveBeenCalledWith(id);
  });
});

const stub = () => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullName: faker.person.fullName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};
