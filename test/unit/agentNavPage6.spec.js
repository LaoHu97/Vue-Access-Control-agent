import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import page6 from '@/views/agent/nav2/Page6.vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

Vue.use(ElementUI)

test('测试', () => {
  // 渲染这个组件
  const wrapper = shallowMount(page6, {
    localVue,
    router
  })
  console.log(wrapper);

})