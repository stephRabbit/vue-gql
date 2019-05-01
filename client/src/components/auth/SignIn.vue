<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >
    <!-- Page title -->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <h1>Welcome back</h1>
      </v-flex>
    </v-layout>

    <!-- Error alert -->
    <v-layout
      row
      wrap
      v-if="error"
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Sign in form -->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <v-card
          color="secondary"
          dark
        >
          <v-container>
            <v-form @submit.prevent="handleSignInUser">
              <v-layout>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    v-model="username"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="lock"
                    label="Password"
                    type="password"
                    v-model="password"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <v-btn :loading="loading" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Sign in
                  </v-btn>
                  <h3>Don't have an account? <router-link to="/signup">Sign up!</router-link></h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SignIn',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'loading',
    ])
  },
  watch: {
    user(value) {
      // If user prop changes, redirect to home page
      if (value) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    handleSignInUser() {
      this.$store.dispatch('signInUser', {
        username: this.username,
        password: this.password,
      })
    }
  }
}
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>