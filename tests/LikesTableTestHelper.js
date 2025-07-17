/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', owner = 'user-123', threadId = 'thread-123', commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, owner, threadId, commentId],
    };

    await pool.query(query);
  },

  async findLikesByOwnerAndCommentId(owner, commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 and comment_id = $2',
      values: [owner, commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
