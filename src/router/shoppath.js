import Abstract from '../views/common/abstract.vue';

export default [{
  path: '/index1',
  name: '交易管理',
  meta: {
    icon: 'icon-shujutongji'
  },
  component: Abstract,
  children: [{
    path: 'table',
    name: '交易查询',
    meta: {
      title: '交易查询', icon: 'table1', noCache: false, code: '',
    },
    component: (resolve) => require(['../views/agent/nav1/Table.vue'], resolve)
  }, {
    path: 'table1',
    name: '交易详情',
    meta: {
      title: '交易详情',
      icon: 'table1',
      noCache: true,
      code: '',
      hidden: true
    },
    component: (resolve) => require(['../views/agent/nav1/Table1.vue'], resolve)
  }]
}, {
    path: '/index1',
    name: '对账结算',
    meta: {
      icon: 'icon-shujutongji'
    },
    component: Abstract,
    children: [{
      path: 'settlement1',
      name: '结算查询',
      meta: {
        title: '结算查询',
        icon: 'table1',
        code: '',
      },
      component: (resolve) => require(['../views/agent/nav6/settlement1.vue'], resolve)
    }, {
      path: 'bill1',
      name: '对账单下载',
      meta: {
        title: '对账单下载',
        icon: 'icon-icon--',
        code: ''
      },
      component: (resolve) => require(['../views/agent/nav5/bill1.vue'], resolve)
    }]
  }, {
  path: '/index2',
  name: '商户管理',
  meta: {
    icon: 'icon-shangjia'
  },
  component: Abstract,
  children: [{
    path: 'page4',
    name: '商户入驻',
    meta: {
      title: '商户入驻', icon: 'table1', noCache: true, code: '',
    },
    component: (resolve) => require(['../views/agent/nav2/Page4.vue'], resolve)
  }, {
    path: 'page5',
    name: '商户列表',
    meta: {
      title: '商户列表', icon: 'table', code: ''
    },
    component: (resolve) => require(['../views/agent/nav2/Page5.vue'], resolve)
  }, {
    path: 'page6',
    name: '商户管理-基本资料',
    meta: {
      title: '商户管理-基本资料', icon: 'table', noTages: true, noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page6.vue'], resolve)
  }, {
    path: 'page7',
    name: '门店管理',
    meta: {
      title: '门店管理', icon: 'table1', noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page7.vue'], resolve)
  }, {
    path: 'page8',
    name: '款台管理',
    meta: {
      title: '款台管理', icon: 'table', noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page8.vue'], resolve)
  }, {
    path: 'page9',
    name: '商户管理-结算信息',
    meta: {
      title: '商户管理-结算信息', icon: 'table', noTages: true, noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page9.vue'], resolve)
  }, {
    path: 'page10',
    name: '商户管理-上传资质',
    meta: {
      title: '商户管理-上传资质', icon: 'table', noTages: true, noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page10.vue'], resolve)
  }, {
    path: 'page12',
    name: '商户查看',
    meta: {
      title: '商户查看', icon: 'table', noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page12.vue'], resolve)
  }, {
    path: 'page13',
    name: '云打印配置',
    meta: {
      title: '云打印配置', icon: 'table', code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page13.vue'], resolve)
  }, {
    path: 'page14',
    name: '终端管理',
    meta: {
      title: '终端管理', icon: 'table', code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page14.vue'], resolve)
  }, {
      path: 'page15',
      name: '微信支付配置',
      meta: {
        title: '微信支付配置', icon: 'table', code: '', hidden: true
      },
      component: (resolve) => require(['../views/agent/nav2/Page15.vue'], resolve)
    }, {
      path: 'page16',
      name: '支付宝支付配置',
      meta: {
        title: '支付宝支付配置', icon: 'table', code: '', hidden: true
      },
      component: (resolve) => require(['../views/agent/nav2/Page16.vue'], resolve)
    }, {
      path: 'page18',
      name: '特殊费率',
      meta: {
        title: '特殊费率',
        icon: 'table',
        code: '',
        hidden: true
      },
      component: (resolve) => require(['../views/agent/nav2/page18.vue'], resolve)
    }
  ]
}, {
  path: '/index3',
  name: '业务管理',
  meta: {
    icon: 'icon-yewu'
  },
  component: Abstract,
  children: [{
    path: 'list1',
    name: '业务员管理',
    meta: {
      title: '业务员管理', icon: 'table1', noCache: true, code: '',
    },
    component: (resolve) => require(['../views/agent/nav3/List1.vue'], resolve)
  }
]
}, {
  path: '/index3',
  name: '分润管理',
  meta: {
    icon: 'icon-fan'
  },
  component: Abstract,
  children: [{
    path: 'tab1',
    name: '分润查询',
    meta: {
      title: '分润查询', icon: 'table1', noCache: false, code: '',
    },
    component: (resolve) => require(['../views/agent/nav4/Tab1.vue'], resolve)
  }, {
    path: 'tab2',
    name: '分润详情',
    meta: {
      title: '分润详情', icon: 'table', code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav4/Tab2.vue'], resolve)
  }]
}]
