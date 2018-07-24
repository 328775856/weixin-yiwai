import request from '../../utils/request';
const getProductDetails = data => request.post('getProductDetails', data);
const getMyCommentList = data => request.post('getMyCommentList', data);
const getHotCommentList = data => request.post('getHotCommentList', data);
const getMoreCommentList = data => request.post('getMoreCommentList', data);
const addComment = data => request.post('addComment', data);



const getCollectState = data => request.post('getCollectState', data);
const setCollect = data => request.post('setCollect', data);

const getProductStatisticsList = data => request.post('getProductStatisticsList', data);
const getProductMediaList = data => request.post('getProductMediaList', data);
const getCustomerVote = data => request.post('getCustomerVote', data);
const votePeach = data => request.post('votePeach', data);


export {
  getProductDetails,
  getMyCommentList,
  getHotCommentList,
  getMoreCommentList,
  addComment,
  getCollectState,
  setCollect,
  getProductStatisticsList,
  getProductMediaList,
  getCustomerVote,
  votePeach
};