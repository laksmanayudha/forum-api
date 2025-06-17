const DeleteComment = require('../../Domains/comments/entitties/DeleteComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    await this._userRepository.verifyUserExist(deleteComment.owner);
    await this._threadRepository.verifyThreadExist(deleteComment.threadId);
    await this._commentRepository.verifyCommentOwner(deleteComment.id, deleteComment.owner);
    return this._commentRepository.deleteComment(deleteComment.id);
  }
}

module.exports = DeleteCommentUseCase;
