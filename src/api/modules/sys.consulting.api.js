export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_CONSULTING_LIST(data = {}) {
    return request({
      url: '/admin/consulting/list/' + data.pageNum + '/' + data.pageSize,
      method: 'get'
    })
  },

  SYS_CONSULTING_DELETE(data = {}) {
    return request({
      url: '/admin/consulting/delete',
      method: 'delete',
      data
    })
  },

  SYS_CONSULTING_PERSON_INFO(data = {}) {
    return request({
      url: '/admin/consulting/getConsultingPerson/' + data.id,
      method: 'get'
    })
  },

  SYS_CONSULTING_REPLY(data = {}) {
    return request({
      url: '/admin/consulting/reply',
      method: 'put',
      data
    })
  },

})
