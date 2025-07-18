const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CreateComment = require('../../../Domains/comments/entitties/CreateComment');
const CreatedComment = require('../../../Domains/comments/entitties/CreatedComment');
const Comment = require('../../../Domains/comments/entitties/Comment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist added comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const createComment = new CreateComment({
        owner: 'user-123',
        content: 'some comment content',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const createComment = new CreateComment({
        owner: 'user-123',
        content: 'some comment content',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'some comment content',
        owner: 'user-123',
      }));
    });

    it('should persist added comment with parentId and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'username-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'username-456' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const createComment = new CreateComment({
        owner: 'user-456',
        content: 'some replied comment content',
        threadId: 'thread-123',
        parentId: 'comment-123',
      });

      const fakeIdGenerator = () => '456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-456');
      expect(comments).toHaveLength(1);
      expect(comments[0].parent_id).toEqual(createComment.parentId);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete a comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      let comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_deleted).toEqual(true);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw AuthorizationError when user authorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when user unauthorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-1234')).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('findCommenstWithOwnerByThreadId function', () => {
    it('should find all comment by threadId with owner username', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'username-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const commentOne = await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-123', threadId: 'thread-123', content: 'comment one',
      });

      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepositoryPostgres.findCommenstWithOwnerByThreadId('thread-123');

      // Assert
      await expect(comments).toHaveLength(1);
      await expect(comments[0]).toStrictEqual(new Comment({
        id: 'comment-123',
        content: 'comment one',
        username: 'username-123',
        date: commentOne.created_at.toISOString(),
        isDeleted: false,
      }));
    });
  });
});
