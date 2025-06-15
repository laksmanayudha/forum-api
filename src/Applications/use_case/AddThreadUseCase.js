const CreateThread = require('../../Domains/threads/entitties/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const newThread = new CreateThread(useCasePayload);
    await this._userRepository.verifyUserExist(newThread.owner);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
