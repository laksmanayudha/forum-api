class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      content,
      username,
      date,
      isDeleted,
    } = payload;

    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
    this.isDeleted = isDeleted;
  }

  _verifyPayload({
    id,
    content,
    username,
    date,
    isDeleted,
  }) {
    if (!id || !content || !username || !date || isDeleted === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
