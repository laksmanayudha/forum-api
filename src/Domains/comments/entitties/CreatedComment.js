class CreatedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      owner,
      content,
    } = payload;

    this.id = id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    id,
    owner,
    content,
  }) {
    if (!owner || !content || !id) {
      throw new Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof content !== 'string' || typeof id !== 'string') {
      throw new Error('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedComment;
