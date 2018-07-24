import request from '../../utils/request';
const setCustomer = data => request.post('setCustomer', data);
const getCustomerInfo = data => request.post('getCustomerInfo',data);
const getArtistInfo = data => request.post('getArtistInfo', data);
const getResourceList = data => request.post('getResourceList',data);
const setArtist = data => request.post('setArtist',data);
const setOrgan = data => request.post('setOrgan',data);
const getOrganByManagerId = data => request.post('getOrganByManagerId',data);
export {
  setCustomer,
  getCustomerInfo,
  getArtistInfo,
  getResourceList,
  setArtist,
  getOrganByManagerId,
  setOrgan
}