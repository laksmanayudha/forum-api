const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entitties/CreatedComment');
const Comment = require('../../Domains/comments/entitties/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const {
      owner,
      content,
      threadId,
      parentId,
    } = createComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, owner, content',
      values: [id, owner, threadId, parentId, content],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };

    return this._pool.query(query);
  }

  async verifyCommentOwner(commentId, owner) {
    const comment = await this.verifyCommentExist(commentId);

    if (comment.owner !== owner) throw new AuthorizationError('Anda tidak berhak menghapus komentar ini');
  }

  async verifyCommentExist(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('komentar tidak ditemukan');

    return result.rows[0];
  }

  async findCommenstWithOwnerByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.*, users.username FROM comments INNER JOIN users ON comments.owner = users.id WHERE thread_id = $1',
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    const comments = rows.map(({
      id,
      content,
      username,
      created_at: createdAt,
      is_deleted: isDeleted,
      parent_id: parentId,
    }) => new Comment({
      id,
      content,
      username,
      isDeleted,
      parentId,
      date: createdAt.toISOString(),
    }));

    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
