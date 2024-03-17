export default ({ request }) => ({

  SYS_IMAGE_LIST() {
    return request({
      url: '/admin/image/list',
      method: 'get'
    })
  },

  SYS_IMAGE_STATUS(data = {}) {
    return request({
      url: `/admin/image/changeStatus/${data.id}/${data.status}`,
      method: 'put'
    })
  },

  SYS_IMAGE_DELETE(data = {}) {
    return request({
      url: '/admin/image/delete/' + data.id,
      method: 'delete'
    })
  },

  SYS_IMAGE_ACTIVITY_LIST() {
    return request({
      url: '/admin/image/activityList',
      method: 'get'
    })
  },

  SYS_IMAGE_BIND_ACTIVITY(data = {}) {
    return request({
      url: '/admin/image/bindActivity',
      method: 'put',
      data
    })
  },

})
