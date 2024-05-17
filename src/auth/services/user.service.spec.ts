import { faker } from '@faker-js/faker';
import { Package } from '../../common/interfaces';
import { AuthDomain } from '../domains';
import { UserQueryModel } from '../interfaces';
import { UserService } from './user.service';

const readRepoMock = {
  findById: jest.fn(),
};
const writeRepoMock = {
  findById: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(readRepoMock as any, writeRepoMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should work given undefined', async () => {
    // Arrange
    const id = faker.string.uuid();

    // Act
    const findByIdSpy = jest.spyOn(readRepoMock, 'findById').mockResolvedValueOnce(undefined);
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
    const findByIdSpy = jest.spyOn(readRepoMock, 'findById').mockResolvedValueOnce(dummy);
    const findByIdDomainSpy = jest
      .spyOn(readRepoMock, 'findById')
      .mockResolvedValueOnce(toDomain(dummy));
    const accessToken = await userService.findById(id);

    // Assert
    expect(accessToken).toBe(dummy);
    expect(findByIdSpy).toHaveBeenCalledWith(id);
    expect(findByIdDomainSpy).toHaveBeenCalledWith(id);
  });
});

const stub = (): UserQueryModel => {
  return {
    id: faker.string.uuid(),
    profile: faker.internet.url(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullName: faker.person.fullName(),
    package: faker.helpers.arrayElement([Package.STANDARD, Package.VERIFIED, Package.NO_QUOTA]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

const toDomain = (user: UserQueryModel) => {
  return AuthDomain.rebuild({ ...user }, user.id);
};
