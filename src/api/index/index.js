import api from '../../config/api'

let proxyId = sessionStorage.getItem("proxyId");
// 顶部六项数据
const getData = () => {
  let params = {'proxyId': proxyId}
  return api._post('/lw-manager/report/getReportMap', params)
}
// 信息数
const getCount = () => {
  let params = {'proxyId': proxyId}
  return api._post('/lw-manager/report/getMessageReportMap', params);
}
// 用户数
const getUserCount = () => {
  let params = {'proxyId': proxyId}
  return api._post('/lw-manager/report/getCustReportMap', params);
}

export default {
  getData,
  getCount,
  getUserCount
}
