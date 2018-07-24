import request from '../../utils/request';

const getMyCommentList = data => request.post('getMyCommentList', data);
const getHotCommentList = data => request.post('getHotCommentList', data);
const getMoreCommentList = data => request.post('getMoreCommentList', data);

const addComment = data => request.post('addComment', data);
const addReply = data => request.post('addReply', data);
const setCommentLike = data => request.post('setCommentLike', data);

export {
  getMyCommentList,
  getHotCommentList,
  getMoreCommentList,
  addComment,
  addReply,
  setCommentLike
};