import request from '../../utils/request';
const getOrganProductList = data => request.post('getOrganProductList', data);

const getProductStatisticsList = data => request.post('getProductStatisticsList',data);

const findByExhibitionId = data => request.post('findByExhibitionId',data);
export {
  getOrganProductList,
  getProductStatisticsList,
  findByExhibitionId
}