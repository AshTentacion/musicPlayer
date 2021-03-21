import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/music-list'
    },
    {
      path: '/music-list',
      name: 'MusicList',
      component: () => import(/* webpackChunkName: "group-footer" */ '../components/MusicList')
    }
  ]
})
