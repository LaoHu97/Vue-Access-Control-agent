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
    name: '实时交易查询',
    meta: {
      title: '实时交易查询', icon: 'table1', noCache: false, code: '',
    },
    component: (resolve) => require(['../views/agent/nav1/Table.vue'], resolve)
  }, {
    path: 'table2',
    name: '商户日交易汇总',
    meta: {
      title: '商户日交易汇总', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav1/Table2.vue'], resolve)
  }, {
    path: 'table4',
    name: '商户月交易汇总',
    meta: {
      title: '商户月交易汇总', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav1/Table4.vue'], resolve)
  }, {
    path: 'table1',
    name: '商户日汇总明细',
    meta: {
      title: '商户日汇总明细', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav1/Table1.vue'], resolve)
  }]
}, {
  path: '/index1',
  name: '交易分析',
  meta: {
    icon: 'icon-shujutongji'
  },
  component: Abstract,
  children: [{
    path: 'table3',
    name: '商户排行榜',
    meta: {
      title: '商户排行榜', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav1/Table3.vue'], resolve)
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
      title: '商户列表', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav2/Page5.vue'], resolve)
  }, {
    path: 'page6',
    name: '新增商户',
    meta: {
      title: '新增商户', icon: 'table', noCache: false, code: '', hidden: true
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
    name: '新增商户',
    meta: {
      title: '新增商户', icon: 'table', noCache: false, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page9.vue'], resolve)
  }, {
    path: 'page10',
    name: '新增商户',
    meta: {
      title: '新增商户', icon: 'table', noCache: false, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page10.vue'], resolve)
  }, {
    path: 'page11',
    name: '审核记录',
    meta: {
      title: '审核记录', icon: 'table', noCache: true, code: '', hidden: false
    },
    component: (resolve) => require(['../views/agent/nav2/Page11.vue'], resolve)
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
      title: '云打印配置', icon: 'table', noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page13.vue'], resolve)
  }, {
    path: 'page14',
    name: '终端管理',
    meta: {
      title: '终端管理', icon: 'table', noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page14.vue'], resolve)
  }, {
    path: 'page15',
    name: '特殊费率',
    meta: {
      title: '特殊费率',
      icon: 'table',
      noCache: true,
      code: '',
      hidden: true
    },
    component: (resolve) => require(['../views/agent/nav2/Page15.vue'], resolve)
  }
  ]
}, {
  path: '/index2',
  name: '业务管理',
  meta: {
    icon: 'icon-yewu'
  },
  component: Abstract,
  children: [{
    path: 'list1',
    name: '业务员管理',
    meta: {
      title: '业务员管理', icon: 'table1', noCache: false, code: '',
    },
    component: (resolve) => require(['../views/agent/nav3/List1.vue'], resolve)
  }, {
    path: 'list2',
    name: '一键分配',
    meta: {
      title: '一键分配', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav3/List2.vue'], resolve)
  }]
}, {
  path: '/index1',
  name: '返佣管理',
  meta: {
    icon: 'icon-fan'
  },
  component: Abstract,
  children: [{
    path: 'tab1',
    name: '结算管理',
    meta: {
      title: '结算管理', icon: 'table1', noCache: true, code: '',
    },
    component: (resolve) => require(['../views/agent/nav4/Tab1.vue'], resolve)
  }, {
    path: 'tab2',
    name: '结算详情',
    meta: {
      title: '结算详情', icon: 'table', noCache: true, code: '', hidden: true
    },
    component: (resolve) => require(['../views/agent/nav4/Tab2.vue'], resolve)
  }, {
    path: 'tab3',
    name: '业务员返佣查询',
    meta: {
      title: '业务员返佣查询', icon: 'table', noCache: true, code: ''
    },
    component: (resolve) => require(['../views/agent/nav4/Tab3.vue'], resolve)
  }]
}, {
  path: '/bill1',
  name: '对账单下载',
  meta: {
    title: '对账单下载', icon: 'icon-icon--', noCache: true, code: ''
  },
  component: (resolve) => require(['../views/agent/nav5/bill1.vue'], resolve)
}, 
{
  path: '/bill2',
  name: '下载列表',
  meta: {
    title: '下载列表', icon: 'icon-icon--', noCache: true, code: ''
  },
  component: (resolve) => require(['../views/agent/nav5/bill2.vue'], resolve)
}
]
