import store from './store'

export default (to, from, next) => {
  !store.getters.user ? next({ path: '/signin' }) : next()
}