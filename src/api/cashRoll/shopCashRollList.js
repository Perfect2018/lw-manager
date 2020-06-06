import api from '../../config/api';

//搜索及分页列表显示
const searchItemList = (pageNum, phone, state) => {
  let params = {
    'phoneNumber': phone,
    'pageNum': pageNum,
    'state': state
  }
  return api._post('/lw-manager/shopCashRoll/selectShopCashRollList', params);
};
//查询店铺
const getShopList = () => {
  return api._post('/lw-manager/shopCashRoll/selectShopCashRoll');

};
//保存券
const addTicket = (shopId, shopName, phoneNumber, totalMoney) => {
  let params = {
    'shopId': shopId,
    'shopName': shopName,
    'phoneNumber': phoneNumber,
    'totalMoney': totalMoney
  }
  return api._post('/lw-manager/shopCashRoll/insertSelectiveShopCashRoll', params)
};

export default {
  searchItemList,
  getShopList,
  addTicket
}
