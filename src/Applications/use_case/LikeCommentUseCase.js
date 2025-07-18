const Like = require('../../Domains/likes/entities/Like');

class LikeCommentUseCase {
  constructor({
    threadRepository, userRepository, commentRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const like = new Like(useCasePayload);

    await this._userRepository.verifyUserExist(like.owner);
    await this._threadRepository.verifyThreadExist(like.threadId);
    await this._commentRepository.verifyCommentExist(like.commentId);
    const isLiked = await this._likeRepository.isLiked(like);

    if (isLiked) {
      await this._likeRepository.deleteLike(like);
    } else {
      await this._likeRepository.addLike(like);
    }
  }
}

module.exports = LikeCommentUseCase;
