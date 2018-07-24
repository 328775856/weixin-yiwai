import request from '../../utils/request';
const getOrganArtistList = data => request.post('getOrganArtistList', data);

const getExhibitionArtistList = data => request.post('getExhibitionArtistList',data);
export {
  getOrganArtistList,
  getExhibitionArtistList
}