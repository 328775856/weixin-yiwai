import request from '../../utils/request';
const getResourceList = data => request.post('getResourceList', data);
export {
  getResourceList
}