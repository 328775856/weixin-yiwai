import request from '../../utils/request';
const getCommentPage = data => request.post('getCommentPage', data);
const getCustomerInfo = data => request.post('getCustomerInfo',data);
const getOrganByManagerId = data => request.post('getOrganByManagerId', data); const getOrganExhibitionList = data => request.post('getOrganExhibitionList',data);

const getOrganProductList = data => request.post('getOrganProductList',data);

const getArtistInfo = data => request.post('getArtistInfo',data);
const getProductStatisticsList = data => request.post('getProductStatisticsList',data);

const getOrganArtistList = data => request.post('getOrganArtistList',data);

const getMyBestComment = data => request.post('getMyBestComment',data);
const getArtistDetails = data => request.post('getArtistDetails',data);

export {
  getCommentPage,
  getCustomerInfo,
  getOrganByManagerId,
  getOrganExhibitionList,
  getOrganProductList,
  getArtistInfo,
  getOrganArtistList,
  getProductStatisticsList,
  getMyBestComment,
  getArtistDetails
}