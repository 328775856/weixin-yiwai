import request from '../../utils/request';
const getProductDetails = data => request.post('getProductDetails', data);
const getCommentInfo = data => request.post('getCommentInfo', data);

export {
  getProductDetails,
  getCommentInfo
};