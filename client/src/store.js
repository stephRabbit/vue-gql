import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import { defaultClient as apolloClient } from './main'
import { GET_CURRENT_USER, GET_POSTS, SIGN_IN_USER } from './queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    user: null,
    error: null,
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload
    },
    setUser: (state, payload) => {
      state.user = payload
    },
    setLoading: (state, payload) => {
      state.loading = payload
    },
    setError: (state, payload) => {
      state.error = payload
    },
    clearUser: (state) => (state.user = null),
    clearError: (state) => (state.error = null),
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true)
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false)
          // Add user to state
          commit('setUser', data.getCurrentUser)
          console.log(data.getCurrentUser)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },
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
    },
    signInUser: ({ commit }, payload) => {
      commit('clearError')
      commit('setLoading', true)
      // Set token to as empty to clear malformed token
      localStorage.setItem('token', '')

      apolloClient
        .mutate({
          mutation: SIGN_IN_USER,
          variables: payload
        })
        .then(({ data }) => {
          console.log(data)
          commit('setLoading', false)
          localStorage.setItem('token', data.signInUser.token)
          // To make sure created method is run in main.js (run getCurrentUser), reload page
          router.go()
        })
        .catch(err => {
          console.error(err)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    signOutUser: async ({ commit }) => {
      // Clear user state
      commit('clearUser')
      // remove token form storage
      localStorage.setItem('token', '')
      // end session
      console.dir(apolloClient)
      await apolloClient.resetStore()
      // Redirect to landing page
      router.push('/')
    },
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
  }
})
