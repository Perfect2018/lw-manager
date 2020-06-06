import api from '../../config/api';

//搜索及分页列表显示
const searchItemList = (pageNum, shopName, operateName, state, isStarShop) => {
  let proxyId = sessionStorage.getItem('proxyId');
  return api._post('/lw-manager/shop/list', {
    shopName,
    operateName,
    state,
    isStarShop,
    pageNum: pageNum + '',
    proxyId
  }, true)
}

const setCusGrade = (i, id) => {
  let params = {
    'i': i,
    'id': id
  }
  return api._post('/lw-manager/shop/upShop', params)
};
//取消明星店铺
const cancleStarShop = (id) => {
  let params = {
    'i': '5',
    'id': id
  }
  return api._post('/lw-manager/shop/upShop', params)

};
//设置明星店铺
const setStarShop = (id) => {
  let params = {
    'i': '3',
    'id': id
  }
  return api._post('/lw-manager/shop/upShop', params);
}
//解冻资金
const cancleShopType = (id) => {
  let params = {
    'i': '12',
    'id': id
  }
  return api._post('/lw-manager/shop/upShop', params)

};
//冻结资金
const setShopType = (id) => {
  let params = {
    'i': '13',
    'id': id
  }
  return api._post('/lw-manager/shop/upShop', params);
}

const setBrandShop = (id) => {
  let params = {
    'i': '4',
    'id': id
  }
  return api._post('/lw-manager/shop/upShop', params);
}

const cancleBrandShop = (id) => {
  let params = {
    'i': '6',
    'id': id
  }
  return api._post('/bcars-fresh/shop/upShop', params);
}
//关店
const closeShop = (id) => {
  let params = {
    'shopState': '99',
    'id': id,
    'isLowerGoods': '03'
  }
  return api._post('/bcars-fresh/shop/deleteShop', params);
}
//开店
const openShop = (id) => {
  let params = {
    'shopState': '01',
    'id': id,
    'isLowerGoods': '01'
  }
  return api._post('/bcars-fresh/shop/deleteShop', params)
}
//通过
const pass = (id) => {
  let params = {
    'i': '1',
    'id': id
  }
  return api._post('/bcars-fresh/shop/upShop', params)
}
//驳回
const reject = (id) => {
  let params = {
    'i': '2',
    'id': id
  }
  return api._post('/bcars-fresh/shop/upShop', params)
}
//获取店铺佣金信息
const getShopExpire = (id) => {
  let params = {
    'id': id
  }
  return api._post('/bcars-fresh/shop/getShopExpire', params);
}
//设置商户的佣金合同
const updateShopExpire = (id, commission, start, end,shopSourceName,shopSourcePhone) => {
  let params = {
    'shopId': id,
    'commission': commission,
    'startDate': start,
    'endDate': end,
    'shopSourceName':shopSourceName,
    'shopSourcePhone':shopSourcePhone
  }
  return api._post('/bcars-fresh/shop/updateShopExpire', params);
}
export default {
  updateShopExpire,
  getShopExpire,
  searchItemList,
  setCusGrade,
  cancleStarShop,
  setStarShop,
  setBrandShop,
  cancleBrandShop,
  closeShop,
  openShop,
  pass,
  reject,
  cancleShopType,
  setShopType
}
