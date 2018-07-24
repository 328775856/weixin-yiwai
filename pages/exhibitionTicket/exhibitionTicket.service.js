import request from '../../utils/request';
// const getExhibitionTickets = data => request.post('getExhibitionTickets', data);

const getExhibition = data => request.post('getExhibition', data);
const setCustomerTicket = data => request.post('setCustomerTicket', data);

export {
  // getExhibitionTickets,
  getExhibition,
  setCustomerTicket
};