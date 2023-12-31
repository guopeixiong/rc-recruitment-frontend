export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  SYS_USER_GET_NORMAL_LIST(data = {}) {
    return request({
      url: '/admin/user/normal/list?pageNo=' + data.pageNo
        + '&pageSize=' + data.pageSize
        + '&stuNum=' + data.stuNum
        + '&fullName=' + data.fullName
        + '&email=' + data.email
        + '&phone=' + data.phone,
      method: 'get',
      data
    })
  },

  SYS_USER_GET_ADMIN_LIST(data = {}) {
    return request({
      url: '/admin/user/admin/list/?pageNo=' + data.pageNo
        + '&pageSize=' + data.pageSize
        + '&fullName=' + data.fullName,
      method: 'get',
      data
    })
  },

  SYS_USER_STATUS(data = {}) {
    return request({
      url: '/admin/user/normal/status',
      method: 'put',
      data
    })
  },

  SYS_USER_ADD_ADMIN(data = {}) {
    return request({
      url: '/admin/user/admin/add',
      method: 'post',
      data
    })
  },

})
