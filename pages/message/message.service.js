import request from '../../utils/request';
const getMsgList = data => request.post('getMsgList', data);
export {
  getMsgList
}