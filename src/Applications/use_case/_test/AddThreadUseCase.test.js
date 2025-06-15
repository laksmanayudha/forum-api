const CreatedThread = require('../../../Domains/threads/entitties/CreatedThread');
const CreateThread = require('../../../Domains/threads/entitties/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
      owner: 'owner-123',
    };

    // mocking
    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));
    mockUserRepository.verifyUserExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository, userRepository: mockUserRepository,
    });
    const createdThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.verifyUserExist).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
    expect(createdThread).toStrictEqual(new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));
  });
});
