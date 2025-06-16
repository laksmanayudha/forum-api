const CreateThread = require('../../Domains/threads/entitties/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const createThread = new CreateThread(useCasePayload);
    await this._userRepository.verifyUserExist(createThread.owner);
    return this._threadRepository.addThread(createThread);
  }
}

module.exports = AddThreadUseCase;
