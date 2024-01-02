export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_COMMON_QA_LIST(data = {}) {
    return request({
      url: '/admin/commonQa/list/' + data.pageNum + '/' + data.pageSize,
      method: 'get',
      data
    })
  },

  SYS_COMMON_QA_UPDATE(data = {}) {
    return request({
      url: '/admin/commonQa/edit',
      method: 'put',
      data
    })
  },

  SYS_COMMON_QA_ADD(data = {}) {
    return request({
      url: '/admin/commonQa/add',
      method: 'post',
      data
    })
  },

  SYS_COMMON_QA_DELETE(data = {}) {
    return request({
      url: '/admin/commonQa/delete',
      method: 'delete',
      data
    })
  },

})
