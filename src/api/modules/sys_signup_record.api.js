export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_SIGN_UP_RECORD_LIST(data = {}) {
    return request({
      url: '/admin/signUpRecord/list?templateId=' + data.templateId
        + '&statusId=' + data.statusId,
      method: 'get'
    })
  },

  SYS_SIGN_UP_RECORD_TMP_LIST(data = {}) {
    return request({
      url: 'admin/signUpRecord/templateList',
      method: 'get'
    })
  },

  SYS_SIGN_UP_RECORD_TMP_STATUS(data = {}) {
    return request({
      url: '/admin/signUpRecord/processStatus/' + data.id,
      method: 'get'
    })
  },

  SYS_SIGN_UP_RECORD_PERSON(data = {}) {
    return request({
      url: '/admin/consulting/getConsultingPerson/' + data.id,
      method: 'get'
    })
  },

  SYS_SIGN_UP_RECORD_DETAIL(data = {}) {
    return request({
      url: '/h5/signUpRecord/auth/getSignUpDetail/' + data.id,
      method: 'get'
    })
  },

  SYS_SIGN_UP_RECORD_NEXT_STATUS(data = {}) {
    return request({
      url: '/admin/signUpRecord/nextStatus',
      method: 'put',
      data
    })
  },

  SYS_SIGN_UP_RECORD_STATUS_END(data = {}) {
    return request({
      url: '/admin/signUpRecord/endStatus',
      method: 'put',
      data
    })
  },

  SYS_SIGN_UP_RECORD_SEND_EMAIL(data = {}) {
    return request({
      url: '/admin/signUpRecord/sendEmail',
      method: 'post',
      data
    })
  },

})
