class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExist(threadId);
    const thread = await this._threadRepository.findThreadWithOwnerById(threadId);
    const comments = await this._commentRepository.findCommenstWithOwnerByThreadId(threadId);
    const likes = await this._likeRepository.findCommentLikeCountByThreadId(threadId);
    const mapComments = this._makeTreeShapedComments(comments, likes);

    return { ...thread, comments: mapComments };
  }

  _makeTreeShapedComments(comments, likes) {
    const findReplies = (currentCommentId) => (
      comments.filter(({ parentId }) => parentId === currentCommentId).map(({
        id,
        username,
        date,
        content,
        isDeleted,
      }) => {
        const likeCount = (likes.find(({ commentId }) => commentId === id)?.count) || 0;
        const replies = findReplies(id);
        return {
          id,
          username,
          date,
          content: isDeleted ? `**${currentCommentId === null ? 'komentar' : 'balasan'} telah dihapus**` : content,
          likeCount,
          replies,
        };
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
    );

    return findReplies(null);
  }
}

module.exports = GetThreadDetailUseCase;
