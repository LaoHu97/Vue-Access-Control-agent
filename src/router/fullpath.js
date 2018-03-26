import shoppath from './shoppath'
const path = [{
    path: '/receivables',
    name: '收款明细',
    meta: {
      title: '收款明细', noCache: true  
    },
    component: (resolve) => require(['../views/index.vue'], resolve),
    children: shoppath
}]

export default path;