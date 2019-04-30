import Vue from 'vue'
import Router from 'vue-router'
import ProtectedRoutes from './ProtectedRoutes'
import Home from './components/Home.vue'
import AddPost from './components/posts/AddPost.vue'
import Post from './components/posts/Post.vue'
import Profile from './components/auth/Profile.vue'
import SignIn from './components/auth/SignIn.vue'
import SignUp from './components/auth/SignUp.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post',
      name: 'Post',
      component: Post
    },
    {
      path: '/post/add',
      name: 'AddPost',
      component: AddPost
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: ProtectedRoutes
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
  ]
})
