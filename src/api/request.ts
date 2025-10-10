import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 30000, // 请求超时时间
  headers: {} // 设置请求头
});

// 添加请求拦截器
request.interceptors.request.use(config => {
  // 在发送请求之前做些什么，比如添加token到headers中
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response;
}, error => {
  // 对响应错误做点什么，比如统一处理错误状态码等
  if (error.response && error.response.status === 401) { // 例如，处理401未授权错误
    // 重定向到登录页面或显示错误提示等操作
  }
  return Promise.reject(error);
});

export default request