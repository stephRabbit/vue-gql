import Vue from 'vue'
import Vuex from 'vuex'
import { defaultClient as apolloClient } from './main'
import { GET_POSTS } from './queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload
    },
    setLoading: (state, payload) => {
      state.loading = payload
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      commit('setLoading', true)
      // Use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // Update state via mutation
          // commit passes data from actions along to mutation
          commit('setPosts', data.getPosts)
          commit('setLoading', false)
          console.log(data.getPosts)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
})
