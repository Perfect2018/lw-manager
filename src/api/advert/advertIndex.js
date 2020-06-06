import api from '../../config/api';

//搜索列表显示
const searchItemList = (putinShopName, advertType, advertContentType, auditState, state) => {
  let params = {
    'putinShopName': putinShopName,
    'advertType': advertType,
    'advertContentType': advertContentType,
    'auditState': auditState,
    'state': state
  }
  return api._post('/lw-manager/advert/getAdvertList', params, true);
};
//保存 修改
const save = (file, id, putinShopName, advertContentType, advertType, state) => {
  let params = new FormData();
  params.append('id', id);
  params.append('putinShopName', putinShopName);
  params.append('advertContentType', advertContentType);
  params.append('advertType', advertType);
  params.append('state', state);
  params.append('file', file.raw);
  return api._upload('/lw-manager/advert/save', params);
};
//删除
const deleteAdvert = (id) => {
  let params = new FormData();
  params.append('id', id);
  return api._upload('/lw-manager/advert/deleteAdvert', params);
};

export default {
  deleteAdvert,
  searchItemList,
  save
}
