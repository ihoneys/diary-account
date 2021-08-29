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

export function getBillData(params) {
  return request({
    url: '/bill/data',
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

export function addBillData(data) {
  return request({
    url: '/bill/add',
    method: 'post',
    data
  })
}

export function getBillDetail(id) {
  return request({
    url: '/bill/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteBillDetail(id) {
  return request({
    url: '/bill/delete',
    method: 'post',
    data: {
      id
    }
  })
}

export function updateBillDetail(data) {
  return request({
    url: '/bill/update',
    method: 'post',
    data
  })
}


export function getUser() {
  return request({
    url: '/user/get_userinfo',
    method: 'get',   
  })
}
