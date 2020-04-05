// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import App from './App'
import router from './router'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    listSize: 8,
    listLayout: 'grid',
    posts: [],
    users: [],
    list: [],
    lastIndex: 0,
    more: true
  },
  mutations: {
    SET_LIST_SIZE (state, listSize) {
      state.listSize = listSize
    },
    SET_LIST_LAYOUT (state, listLayout) {
      state.listLayout = listLayout
    },
    SET_POSTS (status, posts) {
      status.posts = posts
    },
    SET_USERS (status, users) {
      status.users = users
    },
    SET_LIST (status, posts) {
      status.list = [...status.list, ...posts]
    },
    SET_LIST_EMPTY (status) {
      status.list = []
    },
    SET_LAST_INDEX (status, lastIndex) {
      status.lastIndex = lastIndex
    },
    SET_MORE (status, more) {
      status.more = more
    }
  },
  actions: {
    fetchPosts ({dispatch, commit}) {
      Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/users')
      ])
        .then((response) => {
          let posts = response[0].data
          let users = response[1].data

          posts.map((post) => {
            let user = users.find(e => e.id === post.userId)
            if (user) post['user'] = user
          })

          commit('SET_POSTS', posts)
          commit('SET_USERS', users)

          dispatch('setList')
        })
    },
    setList ({dispatch, state, commit}) {
      if (state.lastIndex < state.posts.length - 1) {
        let list = state.posts.slice(state.lastIndex, Number(state.lastIndex) + Number(state.listSize))
        let lastIndex = Number(state.lastIndex) + list.length

        commit('SET_LIST', list)
        commit('SET_LAST_INDEX', lastIndex)

        if (lastIndex >= state.posts.length - 1) commit('SET_MORE', false)
      }
    },
    setListSize ({dispatch, state, commit}, size) {
      commit('SET_LIST_SIZE', size)

      commit('SET_LAST_INDEX', 0)
      commit('SET_LIST_EMPTY', [])
      commit('SET_MORE', true)

      dispatch('setList')
    },
    fetchListData ({commit}) {
      let storage = window.localStorage
      let listSize = storage.getItem('listSize')
      let listLayer = storage.getItem('listLayer')

      if (listSize) commit('SET_LIST_SIZE', listSize)
      if (listLayer) commit('SET_LIST_LAYOUT', listLayer)

      let isMobile = !navigator.platform.toLowerCase().match(/win16|win32|win64|mac|macintel/)
      if (isMobile) commit('SET_LIST_LAYOUT', 'list')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>',
  beforeCreate () {
    store.dispatch('fetchListData')
    store.dispatch('fetchPosts')
  }
}).$mount('#app')
