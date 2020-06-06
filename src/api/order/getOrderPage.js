import api from '../../config/api'

let proxyId = sessionStorage.getItem('proxyId')

export function getList(currentPage, order, cus, state) {
  let params = {
    'pageNum': currentPage,
    'orderNo': order,
    'username': cus,
    'isOutorder': state,
    'proxyId': proxyId
  }
  return api._post('/lw-manager/order/orderList', params)
}
