import request from '../../../../utils/request';

const getYouthProductList = data => request.post('getYouthProductList', data);
const votePeach = data => request.post('votePeach', data);
const getCustomerVote = data => request.post('getCustomerVote', data);
const getActivityComment = data => request.post('getActivityComment', data);
const setCommentLike = data => request.post('setCommentLike', data);

export { getYouthProductList, votePeach, getCustomerVote, getActivityComment, setCommentLike };