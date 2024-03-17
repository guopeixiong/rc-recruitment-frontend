import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  { path: '/signup/record', title: '报名记录', icon: 'list' },
  { path: '/consult', title: '用户咨询', icon: 'comments' },
  { path: '/activity', title: '活动管理', icon: 'flag' }
])

export const menuAside = supplementPath([
  {
    title: '报名管理',
    icon: 'fire',
    children: [
      { path: '/signup/template', title: '报名表模板', icon: 'file' },
      { path: '/signup/process', title: '报名流程', icon: 'retweet' }
    ]
  },
  {
    title: '信息管理',
    icon: 'info',
    children: [
      { path: '/info/introduction', title: '首页简介', icon: 'bookmark' },
      { path: '/info/indexImage', title: '首页轮播图', icon: 'image' },
      { path: '/info/commonQa', title: '常见问题', icon: 'question' },
      { path: '/info/emailTemplate', title: '邮件模板' },
    ]
  },
  {
    title: '用户管理',
    icon: 'users',
    children: [
      { path: '/user/user', title: '普通用户', icon: 'user' },
      { path: '/user/admin', title: '管理员', icon: 'user-plus' }
    ]
  },
  {
    title: '系统管理',
    icon: 'gears',
    children: [
      { path: '/sys/optLog', title: '用户操作日志', icon: 'clone' },
      { path: '/sys/adminOptLog', title: '后台操作日志', icon: 'clone' },
      { path: '/sys/loginLog', title: '登录日志', icon: 'clone' },
      { path: '/log', title: '系统日志', icon: 'bug' },
      { path: '/sys/emailSendRecord', title: '邮件发送记录', icon: 'envelope' }
    ]
  },
  { path: '/mine', title: '我的', icon: 'user' }
])
