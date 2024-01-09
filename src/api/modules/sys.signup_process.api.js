export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_PROCESS_LIST(data = {}) {
    return request({
      url: '/admin/process/list/' + data.pageNum + '/' + data.pageSize,
      method: 'get',
    })
  },

  SYS_PROCESS_DELETE(data = {}) {
    return request({
      url: '/admin/process/delete',
      method: 'delete',
      data
    })
  },

  SYS_PROCESS_STATUS(data = {}) {
    return request({
      url: '/admin/process/status/' + data.id,
      method: 'get'
    })
  },

  SYS_PROCESS_ADD(data = {}) {
    return request({
      url: '/admin/process/add',
      method: 'post',
      data
    })
  },

  SYS_PROCESS_UPDATE(data = {}) {
    return request({
      url: '/admin/process/edit',
      method: 'put',
      data
    })
  },

})
