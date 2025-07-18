const LikeCount = require('../LikeCount');

describe('a LikeCount entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new LikeCount(payload)).toThrowError('LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: {},
      commentId: [],
      count: '489',
    };

    // Action and Assert
    expect(() => new LikeCount(payload)).toThrowError('LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LikeCount object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      count: 2,
    };

    // Action
    const like = new LikeCount(payload);

    // Assert
    expect(like.threadId).toEqual(payload.threadId);
    expect(like.commentId).toEqual(payload.commentId);
    expect(like.count).toEqual(payload.count);
  });
});
