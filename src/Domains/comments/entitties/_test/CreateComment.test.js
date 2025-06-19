const CreateComment = require('../CreateComment');

describe('a CreateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: [],
      content: {},
      threadId: true,
      parentId: 123.4,
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateComment object correctly when parentId undefined', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 'some comment content',
      threadId: 'thread-123',
    };

    // Action
    const createComment = new CreateComment(payload);

    // Assert
    expect(createComment.owner).toEqual(payload.owner);
    expect(createComment.content).toEqual(payload.content);
    expect(createComment.threadId).toEqual(payload.threadId);
    expect(createComment.parentId).toEqual(null);
  });

  it('should create CreateComment object correctly when parentId defined', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 'some comment content',
      threadId: 'thread-123',
      parentId: 'comment-456',
    };

    // Action
    const createComment = new CreateComment(payload);

    // Assert
    expect(createComment.owner).toEqual(payload.owner);
    expect(createComment.content).toEqual(payload.content);
    expect(createComment.threadId).toEqual(payload.threadId);
    expect(createComment.parentId).toEqual(payload.parentId);
  });
});
