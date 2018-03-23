import Abstract from '../views/common/abstract.vue';

export default [{
    path: '/index',
    name: '交易管理',
    meta: {
      icon: 'icon-shujutongji'
    },
    component: Abstract,
    children: [{
      path: 'table',
      name: '交易列表',
      meta: {
        title: '交易列表', icon: 'table1', noCache: false, code:'20180320110132_42',
      },
      component: (resolve) => require(['../views/agent/nav1/Table.vue'], resolve)
    },{
      path: 'table1',
      name: '交易统计',
      meta: {
        title: '交易统计', icon: 'table', noCache: true, code:'20180320110351_43'
      },
      component: (resolve) => require(['../views/agent/nav1/Table1.vue'], resolve)
    },{
      path: 'table2',
      name: '商户日交易统计',
      meta: {
        title: '商户日交易统计', icon: 'table', noCache: true, code:'20180320161920_59'
      },
      component: (resolve) => require(['../views/agent/nav1/Table2.vue'], resolve)
    }]
  },{
    path: '/index',
    name: '商户管理',
    meta: {
      icon: 'icon-shangjia'
    },
    component: Abstract,
    children: [{
      path: 'page4',
      name: '商户入驻',
      meta: {
        title: '商户入驻', icon: 'table1', noCache: false, code:'20180320110406_49',
      },
      component: (resolve) => require(['../views/agent/nav2/Page4.vue'], resolve)
    },{
      path: 'page5',
      name: '商户列表',
      meta: {
        title: '商户列表', icon: 'table', noCache: true, code:'20180320110420_40'
      },
      component: (resolve) => require(['../views/agent/nav2/Page5.vue'], resolve)
    },{
      path: 'page6',
      name: '新增商户',
      meta: {
        title: '新增商户', icon: 'table', noCache: true, code:'20180320144204_9', hidden:true
      },
      component: (resolve) => require(['../views/agent/nav2/Page6.vue'], resolve)
    }]
  },{
    path: '/index',
    name: '业务管理',
    meta: {
      icon: 'icon-yewu'
    },
    component: Abstract,
    children: [{
      path: 'list1',
      name: '业务员管理',
      meta: {
        title: '业务员管理', icon: 'table1', noCache: false, code:'20180320110435_8',
      },
      component: (resolve) => require(['../views/agent/nav3/List1.vue'], resolve)
    },{
      path: 'list2',
      name: '一键分配',
      meta: {
        title: '一键分配', icon: 'table', noCache: true, code:'20180320110450_51'
      },
      component: (resolve) => require(['../views/agent/nav3/List2.vue'], resolve)
    }]
  },{
    path: '/index',
    name: '返佣管理',
    meta: {
      icon: 'icon-fan'
    },
    component: Abstract,
    children: [{
      path: 'tab1',
      name: '结算管理',
      meta: {
        title: '结算管理', icon: 'table1', noCache: false, code:'20180320110502_67',
      },
      component: (resolve) => require(['../views/agent/nav4/Tab1.vue'], resolve)
    },{
      path: 'tab2',
      name: '结算详情',
      meta: {
        title: '结算详情', icon: 'table', noCache: true, code:'20180320144140_98', hidden:true
      },
      component: (resolve) => require(['../views/agent/nav4/Tab2.vue'], resolve)
    }]
  } ]
