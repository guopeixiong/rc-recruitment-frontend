export default ({request}) => ({

  SYS_INDEX_LAST_SIGN_UP() {
    return request({
      url: '/admin/index/getLastSignUp',
      method: 'get'
    })
  },

  SYS_INDEX_LAST_ERROR_LOG() {
    return request({
      url: '/admin/index/getLastErrorLog',
      method: 'get'
    })
  },

  SYS_INDEX_GET_IMAGE() {
    return request({
      url: '/admin/index/getIndexImage',
      method: 'get'
    })
  },

  SYS_INDEX_GET_TEXT() {
    return request({
      url: '/admin/index/getIndexText',
      method: 'get'
    })
  },

  SYS_INDEX_GET_CONSULTING() {
    return request({
      url: '/admin/index/getLastConsulting',
      method: 'get'
    })
  },

  SYS_INDEX_QA() {
    return request({
      url: '/h5/getCommonQaInfo',
      method: 'get'
    })
  }

})
