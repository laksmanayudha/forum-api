const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateThread = require('../../../Domains/threads/entitties/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../../Domains/threads/entitties/CreatedThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist added thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const createThread = new CreateThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const createThread = new CreateThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError when thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('unknownthreadid-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
