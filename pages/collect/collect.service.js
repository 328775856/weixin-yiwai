import request from '../../utils/request';
const getMyCollect = data => request.post('getMyCollect', data);
export {
  getMyCollect
}