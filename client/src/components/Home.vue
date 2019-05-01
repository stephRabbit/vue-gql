<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-dialog v-model="loading" persistant fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular
              color="secondary"
              indeterminate
              :size="70"
              :width="7"
            >
            </v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
        >
          <h1 class="carsousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  created() {
    this.handleGetCarouselPost()
  },
  methods: {
    handleGetCarouselPost() {
      // Reach out to Vuex store, fire action that gets posts for carsousel
      this.$store.dispatch('getPosts')
    }
  },
  computed: {
    ...mapGetters(['posts', 'loading'])
  }
}
</script>
<style>
  .carsousel__title {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px 5px 0 0;
    color: white;
    padding: .5rem;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0;
  }
</style>
