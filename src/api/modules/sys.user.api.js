import { encrypt } from "@/libs/jsencrypt";
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    data.password = encrypt(data.password);
    // 接口请求
    return request({
      url: '/login',
      method: 'post',
      data
    })
  },

  /**
   * 获取用户信息
   * @param data
   * @returns {*}
   * @constructor
   */
  SYS_USER_USERINFO (data = {}) {
    return request({
      url: '/h5/userInfo/auth/getUserInfo',
      method: 'get'
    })
  },

  SYS_USER_UPDATE(data = {}) {
    return request({
      url: '/admin/user/admin/update',
      method: 'put',
      data
    })
  },

  SYS_USER_UPDATE_PWD(data = {}) {
    data = encrypt(data)
    return request({
      url: '/admin/user/admin/update/password',
      method: 'put',
      data
    })
  },
})
