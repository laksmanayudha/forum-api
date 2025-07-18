class LikeCount {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId,
      commentId,
      count,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.count = count;
  }

  _verifyPayload({
    threadId,
    commentId,
    count,
  }) {
    if (!count || !threadId || !commentId) {
      throw new Error('LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof count !== 'number'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
    ) {
      throw new Error('LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCount;
