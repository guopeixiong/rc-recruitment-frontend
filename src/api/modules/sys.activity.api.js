import * as url from "url";

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

  SYS_ACTIVITY_LIST(data = {}) {
    return request({
      url: `/admin/activity/list/${data.pageNum}/${data.pageSize}`,
      method: 'get'
    })
  },

  SYS_ACTIVITY_DELETE(data = {}) {
    return request({
      url: '/admin/activity/delete',
      method: 'delete',
      data
    })
  },

  SYS_ACTIVITY_SIGN_UP_TEMP_LIST() {
    return request({
      url: '/admin/activity/signUpTemplates',
      method: 'get'
    })
  },

  SYS_ACTIVITY_ADD(data = {}) {
    return request({
      url: '/admin/activity/add',
      method: 'post',
      data
    })
  },

  SYS_ACTIVITY_DETAIL(data = {}) {
    return request({
      url: '/admin/activity/getDetail/' + data.id,
      method: 'get'
    })
  },

  SYS_ACTIVITY_EDIT(data = {}) {
    return request({
      url: '/admin/activity/edit',
      method: 'put',
      data
    })
  },

})
