import request from '../../utils/request';

const getHomePage = data => request.post('getHomePage', data);

export { getHomePage };