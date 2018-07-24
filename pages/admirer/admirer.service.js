import request from '../../utils/request';
const getCustomerCommentLike = data => request.post('getCustomerCommentLike', data);
export {
  getCustomerCommentLike
}