import request from './request';
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}


export function getData(params) {
  return request({
    url: '/bill/list',
    method: 'get',
    params
  })
}


export function getTypeList() {
  return request({
    url: '/type/list',
    method: 'get',
  })
}
