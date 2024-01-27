export default ({ request }) => ({
  SYS_INDEX_INFO(data = {}) {
    return request({
      url: '/admin/indexIntro/list/' + data.pageNum + '/' + data.pageSize,
      method: 'get'
    })
  },

  SYS_INDEX_INFO_DELETE(data = {}) {
    return request({
      url: '/admin/indexIntro/delete',
      method: 'delete',
      data
    })
  },

  SYS_INDEX_INFO_ENABLE(data = {}) {
    return request({
      url: '/admin/indexIntro/enable/' + data.id,
      method: 'put'
    })
  },

  SYS_INDEX_INFO_ADD(data = {}) {
    return request({
      url: '/admin/indexIntro/add',
      method: 'post',
      data
    })
  },

  SYS_INDEX_INFO_DETAIL(data = {}) {
    return request({
      url: '/admin/indexIntro/detail/' + data.id,
      method: 'get'
    })
  },

  SYS_INDEX_INFO_UPDATE(data = {}) {
    return request({
      url: '/admin/indexIntro/update',
      method: 'put',
      data
    })
  },

})
