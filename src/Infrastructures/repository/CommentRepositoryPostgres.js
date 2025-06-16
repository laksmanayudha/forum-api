const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entitties/CreatedComment');

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
}

module.exports = CommentRepositoryPostgres;
