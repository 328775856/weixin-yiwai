import request from '../../utils/request';
const demo = data => request.post('demo', data);
const getBannerList = data => request.post('getBannerList', data);
const getNewCommentList = data => request.post('getNewCommentList', data);
const getHomePage = data => request.post('getHomePage', data);

export { demo, getBannerList, getNewCommentList, getHomePage };