const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const Like = require('../../../Domains/likes/entities/Like');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist added like and return added like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const like = new Like({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(like);

      // Assert
      const likes = await LikesTableTestHelper.findLikesByOwnerAndCommentId(
        like.owner, like.commentId,
      );
      expect(likes).toHaveLength(1);
    });

    it('should return registered like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const like = await likeRepositoryPostgres.addLike(new Like({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      }));

      // Assert
      expect(like).toStrictEqual(new Like({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      }));
    });
  });

  describe('deleteLike function', () => {
    it('should delete a like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike({ owner: 'user-123', threadId: 'thread-123', commentId: 'comment-123' });

      let likes = await LikesTableTestHelper.findLikesByOwnerAndCommentId('user-123', 'comment-123');
      expect(likes).toHaveLength(1);

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike(new Like({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      }));

      // Assert
      likes = await LikesTableTestHelper.findLikesByOwnerAndCommentId('comment-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('isLiked function', () => {
    it('should return whether a user already like a comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike({ owner: 'user-123', threadId: 'thread-123', commentId: 'comment-123' });

      const likes = await LikesTableTestHelper.findLikesByOwnerAndCommentId('user-123', 'comment-123');
      expect(likes).toHaveLength(1);

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await likeRepositoryPostgres.isLiked(new Like({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      }));

      // Assert
      expect(isLiked).toEqual(true);
    });
  });
});
