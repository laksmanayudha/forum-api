class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      owner,
      content,
      threadId,
      parentId = null,
    } = payload;

    this.owner = owner;
    this.content = content;
    this.threadId = threadId;
    this.parentId = parentId;
  }

  _verifyPayload({
    owner,
    content,
    threadId,
    parentId,
  }) {
    if (!owner || !content || !threadId) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof content !== 'string' || typeof threadId !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (parentId && typeof parentId !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateComment;
