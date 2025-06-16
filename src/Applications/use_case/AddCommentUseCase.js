const CreateComment = require('../../Domains/comments/entitties/CreateComment');

class AddCommentUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const createComment = new CreateComment(useCasePayload);
    await this._userRepository.verifyUserExist(createComment.owner);
    await this._threadRepository.verifyThreadExist(createComment.threadId);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
