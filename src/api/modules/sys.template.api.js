export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_TEMPLATE_LIST(data = {}) {
    return request({
      url: '/admin/template/list/' + data.pageNum + '/' + data.pageSize,
      method: 'get'
    })
  },

  SYS_TEMPLATE_DELETE(data = {}) {
    return request({
      url: '/admin/template/delete',
      method: 'delete',
      data
    })
  },

  SYS_TEMPLATE_PROCESS_LIST() {
    return request({
      url: '/admin/template/getProcessList',
      method: 'get'
    })
  },

  SYS_TEMPLATE_ADD(data = {}) {
    return request({
      url: '/admin/template/add',
      method: 'post',
      data
    })
  },

  SYS_TEMPLATE_DETAIL(data = {}) {
    return request({
      url: '/admin/template/detail/' + data.id,
      method: 'get'
    })
  },

  SYS_TEMPLATE_UPDATE(data = {}) {
    return request({
      url: '/admin/template/edit',
      method: 'put',
      data
    })
  },

})
