const Like = require('../../Domains/likes/entities/Like');
const LikeCount = require('../../Domains/likes/entities/LikeCount');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike({ owner, threadId, commentId }) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);
    const like = result.rows[0];

    return new Like({
      owner: like.owner, threadId: like.thread_id, commentId: like.comment_id,
    });
  }

  async deleteLike({ owner, threadId, commentId }) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND thread_id = $2 AND comment_id = $3',
      values: [owner, threadId, commentId],
    };

    await this._pool.query(query);
  }

  async isLiked({ owner, threadId, commentId }) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND thread_id = $2 AND comment_id = $3',
      values: [owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return !!result.rowCount;
  }

  async findCommentLikeCountByThreadId(threadId) {
    const query = {
      text: 'SELECT thread_id, comment_id, COUNT(*) as count FROM likes WHERE thread_id = $1 GROUP BY thread_id, comment_id',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((likeCount) => (
      new LikeCount({
        threadId: likeCount.thread_id,
        commentId: likeCount.comment_id,
        count: Number(likeCount.count),
      })
    ));
  }
}

module.exports = LikeRepositoryPostgres;
