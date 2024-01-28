import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      },
      // 信息管理-简介信息
      {
        path: 'info/introduction',
        name: 'introduction',
        meta: {
          title: '首页简介信息',
          auth: true
        },
        component: _import('info_manage/index_page')
      },
      // 信息管理-轮播图
      {
        path: 'info/indexImage',
        name: 'indexImage',
        meta: {
          title: '首页轮播图',
          auth: true
        },
        component: _import('info_manage/index_image')
      },
      // 信息管理-常见问题
      {
        path: 'info/commonQa',
        name: 'commonQa',
        meta: {
          title: '常见问题',
          auth: true
        },
        component: _import('info_manage/common_qa')
      },
      // 信息管理-邮件模板
      {
        path: 'info/emailTemplate',
        name: 'emailTemplate',
        meta: {
          title: '邮件模板',
          auth: true
        },
        component: _import('info_manage/email_template')
      },
      // 我的-个人中心
      {
        path: 'mine',
        name: 'mine',
        meta: {
          title: '我的',
          auth: true
        },
        component: _import('mine')
      },
      // 报名管理-报名表模板
      {
        path: 'signup/template',
        name: 'template',
        meta: {
          title: '报名表模板',
          auth: true
        },
        component: _import('signup_form/form_template')
      },
      // 报名管理-报名流程
      {
        path: 'signup/process',
        name: 'process',
        meta: {
          title: '报名流程',
          auth: true
        },
        component: _import('signup_form/signup_process')
      },
      // 报名管理-报名记录
      {
        path: 'signup/record',
        name: 'record',
        meta: {
          title: '报名记录',
          auth: true
        },
        component: _import('signup_form/signup_record')
      },
      // 面试
      {
        path: 'signup/meeting',
        name: 'meeting',
        meta: {
          title: '面试',
          auth: true
        },
        component: _import('signup_form/signup_meeting')
      },
      {
        path: 'user/user',
        name: 'user',
        meta: {
          title: '用户',
          auth: true
        },
        component: _import('user/default')
      },
      // 用户-普通用户
      {
        path: 'user/admin',
        name: 'admin',
        meta: {
          title: '管理员',
          auth: true
        },
        component: _import('user/admin')
      },
      // 用户咨询
      {
        path: 'consult',
        name: 'consult',
        meta: {
          title: '用户咨询',
          auth: true
        },
        component: _import('user_consultation')
      },
      // 系统管理-用户操作日志
      {
        path: 'sys/optLog',
        name: 'optLog',
        meta: {
          title: '用户操作日志',
          auth: true
        },
        component: _import('system/opt_log')
      },
      // 系统管理-后台操作日志
      {
        path: 'sys/adminOptLog',
        name: 'adminOptLog',
        meta: {
          title: '后台操作日志',
          auth: true
        },
        component: _import('system/admin_opt_log')
      },
      // 系统管理-登录日志
      {
        path: 'sys/loginLog',
        name: 'loginLog',
        meta: {
          title: '登录日志',
          auth: true
        },
        component: _import('system/login_log')
      },
      // 系统管理-邮件发送记录
      {
        path: 'sys/emailSendRecord',
        name: 'emailSendRecord',
        meta: {
          title: '邮件发送记录',
          auth: true
        },
        component: _import('system/email_send_record')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
