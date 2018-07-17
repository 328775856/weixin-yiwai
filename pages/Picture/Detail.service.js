import request from '../../utils/request';
const getProductDetails = data => request.post('getProductDetails', data);
const getMyCommentList = data => request.post('getMyCommentList', data);
const getHotCommentList = data => request.post('getHotCommentList', data);
const getMoreCommentList = data => request.post('getMoreCommentList', data);

export {
  getProductDetails,
  getMyCommentList,
  getHotCommentList,
  getMoreCommentList
};