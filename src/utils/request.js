import axios from 'axios';
 
// 创建axios实例
const service = axios.create({
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  baseURL: 'https://v1.jinrishici.com', // api的base_url
  // baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 5000
});
 
// 请求拦截器
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);
 
// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (!!res.content) {
      return res;
    } else {
      return Promise.reject({
        message: res.message || 'Error',
        status: res.code
      });
    }
  },
  error => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  }
);
 
export default service;