const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const Thread = require('../../../Domains/threads/entitties/Thread');
const Comment = require('../../../Domains/comments/entitties/Comment');

describe('GetThreadDetailUseCase', () => {
  it('should get thread detail correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThread = new Thread({
      id: threadId,
      title: 'thread title',
      body: 'thread body',
      username: 'username',
      date: '2021-08-08T07:22:33.555Z',
    });

    const mockComments = [
      new Comment({
        id: 'comment-456',
        content: 'comment 2',
        username: 'username',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: true,
      }),
      new Comment({
        id: 'comment-123',
        content: 'comment 1',
        username: 'username',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.findThreadWithOwnerById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.findCommenstWithOwnerByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    // Action
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toStrictEqual({
      id: threadId,
      title: 'thread title',
      body: 'thread body',
      username: 'username',
      date: '2021-08-08T07:22:33.555Z',
      comments: [
        {
          id: 'comment-456',
          content: '**komentar telah dihapus**',
          username: 'username',
          date: '2021-08-08T07:22:33.555Z',
          replies: [],
        },
        {
          id: 'comment-123',
          content: 'comment 1',
          username: 'username',
          date: '2021-08-08T07:22:33.555Z',
          replies: [],
        },
      ],
    });
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
    expect(mockThreadRepository.findThreadWithOwnerById).toBeCalledWith(threadId);
    expect(mockCommentRepository.findCommenstWithOwnerByThreadId).toBeCalledWith(threadId);
  });

  it('should get thread detail and comment replies correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThread = new Thread({
      id: threadId,
      title: 'thread title',
      body: 'thread body',
      username: 'username',
      date: '2021-08-08T07:22:33.555Z',
    });

    const mockComments = [
      new Comment({
        id: 'comment-456',
        content: 'comment 2',
        username: 'username',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: true,
      }),
      new Comment({
        id: 'comment-123',
        content: 'comment 1',
        username: 'username',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: false,
      }),
      new Comment({
        id: 'comment-789',
        content: 'comment 3',
        username: 'username',
        date: '2021-08-08T07:22:33.555Z',
        parentId: 'comment-123',
        isDeleted: false,
      }),
      new Comment({
        id: 'comment-012',
        content: 'comment 4',
        username: 'username',
        parentId: 'comment-123',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: true,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.findThreadWithOwnerById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.findCommenstWithOwnerByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    // Action
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toStrictEqual({
      id: threadId,
      title: 'thread title',
      body: 'thread body',
      username: 'username',
      date: '2021-08-08T07:22:33.555Z',
      comments: [
        {
          id: 'comment-456',
          content: '**komentar telah dihapus**',
          username: 'username',
          date: '2021-08-08T07:22:33.555Z',
          replies: [],
        },
        {
          id: 'comment-123',
          content: 'comment 1',
          username: 'username',
          date: '2021-08-08T07:22:33.555Z',
          replies: [
            {
              id: 'comment-789',
              content: 'comment 3',
              username: 'username',
              date: '2021-08-08T07:22:33.555Z',
              replies: [],
            },
            {
              id: 'comment-012',
              content: '**komentar telah dihapus**',
              username: 'username',
              date: '2021-08-08T07:22:33.555Z',
              replies: [],
            },
          ],
        },
      ],
    });
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
    expect(mockThreadRepository.findThreadWithOwnerById).toBeCalledWith(threadId);
    expect(mockCommentRepository.findCommenstWithOwnerByThreadId).toBeCalledWith(threadId);
  });
});
