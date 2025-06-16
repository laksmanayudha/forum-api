const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  const user = { id: 'user-123', username: 'username-123' };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: user.id, username: user.username });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread-title',
        body: 'thread-body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread-title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: ['thread-title'],
        body: {},
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread comments', async () => {
      // Arrange
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: user.id });

      const requestPayload = {
        content: 'some comment content',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: user.id });

      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: user.id });

      const requestPayload = {
        content: [],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'some comment content',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/unknownthreadid/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: user.id,
            username: user.username,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
