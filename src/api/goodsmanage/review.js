import api from '../../config/api'

let proxyId = sessionStorage.getItem('proxyId');

export function getList() {
  let params = {'proxyId': proxyId}
  return api._post('/bcars-fresh/goodsmanage/review', params);
}

export function searchItem(i, j, b, k) {
  let params = {
    'shopName': i,
    'goodsName': j,
    'isGlobalGoods': b,
    'isRecommendGoods': k,
    'proxyId': proxyId
  };
  return api._post('/bcars-fresh/goodsmanage/review', params);
}

export function selected(str, message) {
  let params = {
    'goodsCode': str,
    'type': '04',
    'note': message
  }
  return api._post('/bcars-fresh/goodsmanage/operatingGoods', params);
}

export function pass(str) {
  let params = {
    'goodsCode': str,
    'type': '02',
    'note': ''
  }
  return api._post('/bcars-fresh/goodsmanage/operatingGoods', params);
}
