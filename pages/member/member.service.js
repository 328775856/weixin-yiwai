import request from '../../utils/request';
const getCustomerInfo = data => request.post('getCustomerInfo', data);
const getArtistInfo = data => request.post('getArtistInfo',data);
const getOrganByManagerId = data => request.post('getOrganByManagerId',data);

const getLikeAndReplyMsgNum = data => request.post('getLikeAndReplyMsgNum',data);
export {
  getCustomerInfo,
  getArtistInfo,
  getOrganByManagerId,
  getLikeAndReplyMsgNum
}