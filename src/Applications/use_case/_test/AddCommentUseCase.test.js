const AddCommentUseCase = require('../AddCommentUseCase');
const CreatedComment = require('../../../Domains/comments/entitties/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const CreateComment = require('../../../Domains/comments/entitties/CreateComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'owner-123',
      content: 'some comment content',
      threadId: 'thread-123',
    };

    // mocking
    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      owner: useCasePayload.owner,
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyUserExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));

    // Action
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });
    const createdThread = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockUserRepository.verifyUserExist).toBeCalledWith(useCasePayload.owner);
    expect(mockCommentRepository.addComment).toBeCalledWith(new CreateComment({
      owner: useCasePayload.owner,
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
    }));
    expect(createdThread).toStrictEqual(new CreatedComment({
      id: 'comment-123',
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));
  });
});
