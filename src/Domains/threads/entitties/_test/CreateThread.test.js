const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain neede property', () => {
    // Arrange
    const payload = {
      title: 'thread title',
      body: 'thread body',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'owner',
      title: {},
      body: [],
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'thread-owner',
      title: 'thread title',
      body: 'thread body',
    };

    // Action
    const createThread = new CreateThread(payload);

    // Assert
    expect(createThread.owner).toEqual(payload.owner);
    expect(createThread.title).toEqual(payload.title);
    expect(createThread.body).toEqual(payload.body);
  });
});
