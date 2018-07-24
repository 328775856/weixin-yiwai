import request from '../../utils/request';
const getOrganExhibitionList = data => request.post('getOrganExhibitionList', data);
const getArtistExhibitionList = data => request.post('getArtistExhibitionList',data);
export {
  getOrganExhibitionList,
  getArtistExhibitionList
}