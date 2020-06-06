import api from '../../config/api';

//搜索列表显示
const searchItemList = (categoryName) => {
  let params = {
    'categoryName': categoryName
  }
  return api._post('/lw-manager/category/queryCategoryParam', params);
};
//编辑
const updateCategoryShop = (file,id,  name) => {
  let params = new FormData();
  params.append('id', id);
  params.append('name', name);
  params.append('file', file.raw);
  return api._upload('/lw-manager/category/updateCategoryShop', params);
};

export default {
  searchItemList,
  updateCategoryShop
}
