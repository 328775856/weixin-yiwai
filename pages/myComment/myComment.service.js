import request from '../../utils/request';
const getCommentPage = data => request.post('getCommentPage', data);
const getMyBestComment = data => request.post('getMyBestComment',data);
export {
  getMyBestComment,
  getCommentPage
}