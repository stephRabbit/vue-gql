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
            <v-form
              lazy-validation
              ref="form"
              @submit.prevent="handleSignInUser"
              v-model="isFormValid"
            >
              <v-layout>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    v-model="username"
                    :rules="usernameRules"
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
                    :rules="passwordRules"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <v-btn
                    color="accent"
                    type="submit"
                    :loading="loading"
                    :disabled="!isFormValid || loading"
                  >
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
      isFormValid: true,
      username: '',
      password: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username => username.length < 10 || 'Username must be less than 10 characters',
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Password must be 4 characters or more',
      ]
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
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signInUser', {
          username: this.username,
          password: this.password,
        })
      }
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