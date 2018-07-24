import request from '../../../../utils/request';

const getYouthProductList = data => request.post('getYouthProductList', data);
const votePeach = data => request.post('votePeach', data);
const getCustomerVote = data => request.post('getCustomerVote', data);

export { getYouthProductList, votePeach,getCustomerVote};