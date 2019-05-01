import Vue from 'vue'
import './plugins/vuetify'
import router from './router'
import store from './store'
import App from './App.vue'

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

import FormAlert from './components/shared/FormAlert.vue'

// Globally registered components
Vue.component('form-alert', FormAlert)

Vue.use(VueApollo)

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // Include auth token with request made to BE
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // if no token with key of in 'token' localStorage, add it
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', '')
    }

    // operation adds token to autorization header,
    // which is sent BE
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError)
    }

    if (graphQLErrors) {
      for(let err of graphQLErrors) {
        console.dir(err)
      }
    }
  }
})

const apolloProvider = new VueApollo({ defaultClient })

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    // Execute getCurrentUser query on page load
    this.$store.dispatch('getCurrentUser')
  }
}).$mount('#app')
