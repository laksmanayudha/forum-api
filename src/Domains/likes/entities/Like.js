class Like {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      owner,
      threadId,
      commentId,
    } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({
    owner,
    threadId,
    commentId,
  }) {
    if (!owner || !threadId || !commentId) {
      throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof owner !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
    ) {
      throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Like;
