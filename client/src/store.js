import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import { defaultClient as apolloClient } from './main'
import {
  GET_CURRENT_USER,
  GET_POSTS,
  SIGN_IN_USER,
  SIGN_UP_USER,
  SEARCH_POSTS,
  ADD_POST
} from './queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    user: null,
    error: null,
    authError: null,
    searchResults: []
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
    setAuthError: (state, payload) => {
      state.searchResults = payload
    },
    setSearchResults: (state, payload) => {
      if (payload) {
        state.searchResults = payload
      }
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = []),
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
          console.log('[Catch][GET_CURRENT_USER]')
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
    searchPosts: ({ commit }, payload) => {
      apolloClient
      .query({
        query: SEARCH_POSTS,
        variables: payload,
      })
      .then(({ data }) => {
        commit('setLoading', false)
        // Add user to state
        commit('setSearchResults', data.searchPosts)
      })
      .catch(err => {
        commit('setLoading', false)
        console.error(err)
        console.log('[Catch][SEARCH_POSTS]')
      })
    },
    addPost: ({ commit }, payload) => {
      commit('setLoading', true)
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // Read root query to get the update (addPost)
            const data = cache.readQuery({ query: GET_POSTS })
            // Create updated data - add the new post to the begining of GET_POSTS
            data.getPosts.unshift(addPost)
            // Write update back to query
            console.log(data)
            cache.writeQuery({
              query: GET_POSTS,
              data
            })
          },
          // Ensures that data is added immediately as specified for the update
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload,
            }
          }
        })
        .then(({ data }) => {
          commit('setLoading', false)
          console.log(data.addPost)
        })
        .catch(err => {
          console.error(err)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    signInUser: ({ commit }, payload) => {
      commit('clearError')
      commit('setLoading', true)
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
    signUpUser: async ({ commit }, payload) => {
      commit('clearError')
      commit('setLoading', true)
      apolloClient
        .mutate({
          mutation: SIGN_UP_USER,
          variables: payload
        })
        .then(({ data }) => {
          console.log(data)
          commit('setLoading', false)
          localStorage.setItem('token', data.signUpUser.token)
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
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites,
    searchResults: state => state.searchResults,
  }
})
