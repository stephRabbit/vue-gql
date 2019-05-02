<template>
  <v-app style="background: #E3E3EE">
    <!-- Horizontal toolbar -->
    <v-navigation-drawer
      app
      temporary
      fixed
      v-model="sideNav"
    >
      <v-toolbar
        dark
        flat
        color="accent"
      >
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link
          to="/"
          tag="span"
          style="cursor:pointer"
        >
          <h1 class="title pl-3">ShareIt</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>
      <v-list>
        <v-list-tile
          ripple
          :key="item.route"
          :to="item.route"
          v-for="item in navItemsSide"
        >
          <v-list-tile-action>
            <v-icon left>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>

        <!-- Sign out link -->
        <v-list-tile
          ripple
          v-if="user"
          @click="handleSignOutUser"
        >
          <v-list-tile-action>
            <v-icon left>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Sign out
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal toolbar -->
    <v-toolbar
      fixed
      color="primary"
      dark
    >
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link
          to="/"
          tag="span"
          style="cursor:pointer"
        >
          ShareIt
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search input -->
      <v-text-field
        flex
        prepend-icon="search"
        placeholder="Search post"
        single-line
      >
      </v-text-field>

      <v-spacer></v-spacer>

      <!-- Navbar links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          class="hidden-sm-only"
          :key="item.route"
          :to="item.route"
          v-for="item in navItems"
        >
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- Porfile link -->
        <v-btn
          flat
          to="/profile"
          v-if="user"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >
            account_box
          </v-icon>
          <v-badge
            right
            color="blue darken-2"
          >
            <!-- <span slot="badge">1</span> -->
            Profile
          </v-badge>
        </v-btn>

        <!-- Sign out link -->
        <v-btn
          flat
          class="hidden-sm-only"
          v-if="user"
          @click="handleSignOutUser"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >
            exit_to_app
          </v-icon>
          Sign out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- Main views from router -->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Auth Success SnackBar -->
        <v-snackbar
          bottom
          left
          color="success"
          :timeout="5000"
          v-model="authSnackbar"
        >
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn
            dark
            flat
            @click="authSnackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>

        <!-- Auth Error SnackBar -->
        <v-snackbar
          bottom
          left
          color="warning"
          :timeout="5000"
          v-model="authErrorSnackbar"
          v-if="authError"
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn
            dark
            flat
            to="/signin"
          >
            Sign In
          </v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
    }
  },
  computed: {
    ...mapGetters(['authError', 'user']),
    navItems() {
      let item = [
        { icon: 'chat', title: 'Post', route: '/post' },
        { icon: 'lock_open', title: 'Sign In', route: '/signin' },
        { icon: 'create', title: 'Sign Up', route: '/signup' }
      ]

      if (this.user) {
        item = [
          { icon: 'chat', title: 'Post', route: '/post' }
        ]
      }

      return item
    },
    navItemsSide() {
      let item =  [
        { icon: 'chat', title: 'Post', route: '/post' },
        { icon: 'lock_open', title: 'Sign In', route: '/signin' },
        { icon: 'create', title: 'Sign Up', route: '/signup' }
      ]

      if (this.user) {
        item = [
          { icon: 'chat', title: 'Post', route: '/post' },
          { icon: 'stars', title: 'Create Post', route: '/post/add' },
          { icon: 'account_box', title: 'Profile', route: '/profile' },
        ]
      }

      return item
    }
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true
      }
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav
    },
    handleSignOutUser() {
      this.$store.dispatch('signOutUser')
    }
  }
}
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    /* transition-property: all; */
    transition-property: opacity;
    transition-duration: .2s;
  }

  .fade-enter-active {
    transition-delay: .2s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    /* transform: translateX(-25px) */
  }
</style>

