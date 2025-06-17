const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the deleted comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyUserExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockUserRepository.verifyUserExist)
      .toBeCalledWith(useCasePayload.owner);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.id);
  });
});
