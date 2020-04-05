import Vue from 'vue'
import VueRouter from 'vue-router'
import Posts from '@/components/Posts'
import View from '@/components/View'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Posts
    },
    {
      path: '/view/:postId',
      component: View
    }
  ]
})
