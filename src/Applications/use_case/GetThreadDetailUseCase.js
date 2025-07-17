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
    const mapComments = this._makeTreeShapedComments(comments);

    return { ...thread, comments: mapComments };
  }

  _makeTreeShapedComments(comments) {
    const findReplies = (currentCommentId) => (
      comments.filter(({ parentId }) => parentId === currentCommentId).map(({
        id,
        username,
        date,
        content,
        isDeleted,
      }) => ({
        id,
        username,
        date,
        content: isDeleted ? `**${currentCommentId === null ? 'komentar' : 'balasan'} telah dihapus**` : content,
        replies: findReplies(id, comments),
      })).sort((a, b) => new Date(a.date) - new Date(b.date))
    );

    return findReplies(null);
  }
}

module.exports = GetThreadDetailUseCase;
