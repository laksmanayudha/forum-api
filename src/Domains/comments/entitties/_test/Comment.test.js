const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'username',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      content: {},
      username: true,
      date: 123.4,
      isDeleted: 'test',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment content',
      username: 'username',
      date: '2021-08-08T07:22:33.555Z',
      isDeleted: true,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.isDeleted).toEqual(payload.isDeleted);
  });
});
