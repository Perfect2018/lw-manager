import api from '../../config/api';

function login(custToken, username, identify_pic_val, password) {
  let params = {custToken, username, identify_pic_val, password};
  return api._post('/lw-manager/loginSubmit', params, true);
  // return api._post('/bcars-fresh/loginSubmit', params, true)
}

function logout() {
  return api._post('/lw-manager/loginOut', {})
}

export default {login, logout}
