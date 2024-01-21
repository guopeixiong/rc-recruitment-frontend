export default ({request}) => ({

  SYS_LOG_LIST(data = {}) {
    return request({
      url: `/admin/userLog?pageNum=${data.pageNum}&pageSize=${data.pageSize}&type=${data.type}
      &title=${data.title || ''}&requestMethod=${data.requestMethod || ''}&status=${data.status}`
      + (data.startTime !== null ? `&startTime=${data.startTime}&endTime=${data.endTime}` : ''),
      method: 'get'
    })
  },

  SYS_LOG_TITLE_LIST(data = {}) {
    return request({
      url: '/admin/title/list/' + data.type,
      method: 'get'
    })
  }

})
