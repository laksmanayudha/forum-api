const Like = require('../Like');

describe('a Like entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new Like(payload)).toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      threadId: {},
      commentId: [],
    };

    // Action and Assert
    expect(() => new Like(payload)).toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Like object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const like = new Like(payload);

    // Assert
    expect(like.owner).toEqual(payload.owner);
    expect(like.threadId).toEqual(payload.threadId);
    expect(like.commentId).toEqual(payload.commentId);
  });
});
