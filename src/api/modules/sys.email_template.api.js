export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_EMAIL_TMP_LIST(data = {}) {
    return request({
      url: '/admin/emailTemplate/list/' + data.pageNum + '/' + data.pageSize,
      method: 'get',
      data
    })
  },

  SYS_EMAIL_TMP_UPDATE(data = {}) {
    return request({
      url: '/admin/emailTemplate/update',
      method: 'put',
      data
    })
  },

  SYS_EMAIL_TMP_ADD(data = {}) {
    return request({
      url: '/admin/emailTemplate/add',
      method: 'post',
      data
    })
  },

  SYS_EMAIL_TMP_DELETE(data = {}) {
    return request({
      url: '/admin/emailTemplate/delete',
      method: 'delete',
      data
    })
  },

  SYS_EMAIL_SEND_RECORD(data = {}) {
    return request({
      url: `/admin/emailSendRecord/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&email=${data.email}&title=${data.title}` +
        (data.startTime != null ? `&startTime=${data.startTime}&endTime=${data.endTime}` : ''),
      method: 'get'
    })
  },

})
