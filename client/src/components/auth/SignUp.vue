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
        <h1>Create an account!</h1>
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

    <!-- Sign up form -->
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
          color="accent"
          dark
        >
          <v-container>
            <v-form
              lazy-validation
              ref="form"
              @submit.prevent="handleSignUpUser"
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
                    prepend-icon="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
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
                  <v-text-field
                    prepend-icon="gavel"
                    label="Confirm Password"
                    type="password"
                    v-model="passwordConfirmation"
                    :rules="passwordRules"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <v-btn
                    color="info"
                    type="submit"
                    :loading="loading"
                    :disabled="!isFormValid || loading"
                  >
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Sign in
                  </v-btn>
                  <h3>Already have an account? <router-link to="/signin">Sign in!</router-link></h3>
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
  name: 'SignUp',
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username => username.length < 11 || 'Username must be less than 10 characters',
      ],
      emailRules: [
        email => !!email || 'email is required',
        email => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/.test(email) || 'Invalid email',
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Password must be 4 characters or more',
        comfirmation => comfirmation === this.password || 'Passwords must match'
      ],
    }
  },
  computed: {
    ...mapGetters([
      'error',
      'loading',
      'user'
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
    handleSignUpUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signUpUser', {
          username: this.username,
          email: this.email,
          password: this.password,
        })
      }
    }
  }
};
</script>