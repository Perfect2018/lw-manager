import api from '../../config/api'

let proxyId = sessionStorage.getItem('proxyId');

export function getGoodsList(pageNum, shopName, isGlobalGoods, isLowerGoods, state) {
  let params = {
    'pageNum': pageNum,
    'shopName': shopName,
    'isGlobalGoods': isGlobalGoods,
    'isLowerGoods': isLowerGoods,
    'state': state,
    'proxyId': proxyId
  }
  return api._post('/lw-manager/goodsmanage/getgoods', params);
}

export function updatagoods(id, i, w) {
  let params = {
    'id': id,
    'i': i,
    'w': w
  }
  return api._post('/lw-manager/goodsmanage/updatagoods', params);
}
