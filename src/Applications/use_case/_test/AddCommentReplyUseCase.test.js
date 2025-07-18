const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateComment = require('../../../Domains/comments/entitties/CreateComment');
const CreatedComment = require('../../../Domains/comments/entitties/CreatedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase');

describe('AddCommentReplyUseCase', () => {
  it('should orchestrating the add comment reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'owner-123',
      content: 'some reply comment content',
      threadId: 'thread-123',
      parentId: 'comment-123',
    };

    // mocking
    const mockCreatedComment = new CreatedComment({
      id: 'comment-456',
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
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));

    // Action
    const addCommentReplyUseCase = new AddCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });
    const createdComment = await addCommentReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockUserRepository.verifyUserExist).toBeCalledWith(useCasePayload.owner);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.parentId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new CreateComment({
      owner: useCasePayload.owner,
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      parentId: useCasePayload.parentId,
    }));
    expect(createdComment).toStrictEqual(new CreatedComment({
      id: 'comment-456',
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));
  });
});
