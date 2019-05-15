<template>
  <v-container class="tex-xs-center">
    <!-- User Details -->
    <v-flex sm6 offset-sm3>

        <v-card class="white--text" color="secondary">
          <v-layout>
            <v-flex xs5>
              <v-img
                height="125px"
                contain
                :src="user.avatar"
              >
              </v-img>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{user.username}}</div>
                  <div>Joined {{user.joinDate}}</div>
                  <div class="hidden-xs-only font-weight-regular">{{user.favorites.length}} Favorites</div>
                  <div class="hidden-xs-only font-weight-thin">2 Posts Added</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
    </v-flex>

    <!-- Post Favorited by  user -->
    <v-layout
      row
      wrap
      v-if="!userFavorites.length"
    >
      <h2>You have no favorites. Go add some!</h2>
    </v-layout>
    <v-container
      class="mt-3"
      v-else
    >
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">{{userFavorites.length}}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          v-for="fav in userFavorites"
          :key="fav._id"
        >
          <v-card class="mt-3 m1-1 mr-2" hover>
            <v-img height="30vh" :src="fav.imageUrl"></v-img>
            <v-card-text>{{fav.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['user', 'userFavorites'])
  }
};
</script>