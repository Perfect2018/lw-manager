import axios from 'axios';
import config from './config';
import qs from 'qs'

let headers = {};
const _setHeader = (data = {}) => {
  for (let i in data) {
    headers[i] = data[i];
  }
};
// get方法
const _get = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    const options = {url, method: "get"}
    options.params = qs.stringify(data);
    axios(options).then(res => {
      // console.log('返回数据', res)
      resolve(res.data)
    }).catch(error => {
      reject()
      // console.error(error)
    })
  })
};
// post方法
const _post = (url, data = {}, flag = false) => {
  let token = sessionStorage.getItem("token");
  if (token) {
    headers['token'] = token;
  }
  if (flag) {
    headers['Content-Type'] = 'application/json;charset=utf-8';
  } else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    data = qs.stringify(data)
  }
  return new Promise((resolve, reject) => {
    const options = {url, method: "post", headers};
    options.data = data;
    axios(options).then(res => {
      // console.log('返回数据', res);
      resolve(res.data)
    }).catch(error => {
      reject()
      console.error(error)
    })
  })
};
// 文件上传
const _upload = (url, data = {}) => {
  let token = sessionStorage.getItem("token");
  if (token) {
    headers['token'] = token;
  }
  const $axios = axios.create({
    withCredentials: true
  })
  return new Promise((resolve, reject) => {
    const options = {url, method: "post", headers};
    options.data = data;
    $axios(options).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject();
      console.error(error);
    })
  })
};
const _setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, value)
}
export default {
  _upload,
  _get,
  _post,
  _setHeader,
  _setSessionStorage
}


