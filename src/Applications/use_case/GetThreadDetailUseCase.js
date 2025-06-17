const Thread = require('../../Domains/threads/entitties/Thread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExist(threadId);
    const thread = await this._threadRepository.findThreadWithOwnerById(threadId);
    const comments = await this._commentRepository.findCommenstWithOwnerByThreadId(threadId);
    const mapComments = comments.map(({
      id,
      username,
      date,
      content,
      isDeleted,
    }) => ({
      id, username, date, content: isDeleted ? '**komentar telah dihapus**' : content,
    }));

    return { ...thread, comments: mapComments };
  }
}

module.exports = GetThreadDetailUseCase;
