import request from '../../utils/request';
const getCustomerTicketsList = data => request.post('getCustomerTicketsList', data);
export {
  getCustomerTicketsList
}