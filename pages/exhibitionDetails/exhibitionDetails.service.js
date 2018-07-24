import request from '../../utils/request';
const getExhibition = data => request.post('getExhibition', data);

const getExhibitionArtistList = data => request.post('getExhibitionArtistList', data);


const findByExhibitionId = data => request.post('findByExhibitionId', data);
const getExhibitionCommentPage = data => request.post('getExhibitionCommentPage', data);
const addExhibitionComment = data => request.post('addExhibitionComment', data);
const setExhibitionCommentLike = data => request.post('setExhibitionCommentLike', data);
const getExhibitionTickets = data => request.post('getExhibitionTickets', data);

export {
  getExhibition,
  getExhibitionArtistList,
  findByExhibitionId,
  getExhibitionCommentPage,
  addExhibitionComment,
  setExhibitionCommentLike,
  getExhibitionTickets
};