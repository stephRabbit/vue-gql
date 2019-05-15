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
        color="secondary"
        prepend-icon="search"
        placeholder="Search post"
        single-line
        v-model="searchTerm"
        @input="handleSearchPosts"
      >
      </v-text-field>

      <!-- Search Results Card -->
      <v-card
        dark
        v-if="searchResults.length"
        id="search__card"
      >
        <v-list>
          <v-list-tile
            @click="goToSearchResult(result._id)"
            v-for="result in searchResults"
            :key="result._id"
          >
            <v-list-tile-title>
              {{result.title}} -
              <span class="font-weight-thin">{{formatDescription(result.description)}}</span>
            </v-list-tile-title>

            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

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
            :class="{'bounce':badgeAnimated}"
          >
            <span v-if="userFavorites.length" slot="badge">{{userFavorites.length}}</span>
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
      badgeAnimated: false,
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      searchTerm: '',
    }
  },
  computed: {
    ...mapGetters([
      'authError',
      'user',
      'userFavorites',
      'searchResults',
    ]),
    navItems() {
      let item = [
        { icon: 'chat', title: 'Posts', route: '/posts' },
        { icon: 'lock_open', title: 'Sign In', route: '/signin' },
        { icon: 'create', title: 'Sign Up', route: '/signup' }
      ]

      if (this.user) {
        item = [
          { icon: 'chat', title: 'Posts', route: '/posts' }
        ]
      }

      return item
    },
    navItemsSide() {
      let item =  [
        { icon: 'chat', title: 'Posts', route: '/posts' },
        { icon: 'lock_open', title: 'Sign In', route: '/signin' },
        { icon: 'create', title: 'Sign Up', route: '/signup' }
      ]

      if (this.user) {
        item = [
          { icon: 'chat', title: 'Posts', route: '/posts' },
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
    },
    userFavorites(value) {
      // If user value changes
      if (value) {
        this.badgeAnimated = true
        setTimeout(() => {this.badgeAnimated = false}, 1000)
      }
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav
    },
    handleSignOutUser() {
      this.$store.dispatch('signOutUser')
    },
    handleSearchPosts() {
      this.$store.dispatch('searchPosts', { searchTerm: this.searchTerm })
    },
    goToSearchResult(resultId) {
      // Clear searchTerm
      this.searchTerm = ''
      // Route user to post === resultId
      this.$router.push(`/posts/${resultId}`)
      // Clear state
      this.$store.commit('clearSearchResults')
    },
    formatDescription(description) {
      return description.length > 30 ? `${description.slice(0, 30)} ...` : description
    },
    checkIfUserFavorite(resultId) {
      return this.userFavorites && this.userFavorites.some(fav => fav._id === resultId)
    },
  }
}
</script>

<style scoped>
  #search__card {
    position: absolute;
    width: 100vw;
    top: 100%;
    left: 0;
    z-index: 8;
  }

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

  .bounce {
    animation: bounce 1s both;
  }

  @keyframes bounce {
    0%, 20%, 53%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -50%, 0);
    }
    70% {
      transform: translate3d(0, -10%, 0);
    }
    90% {
      transform: translate3d(0, -4%, 0);
    }
  }
</style>

