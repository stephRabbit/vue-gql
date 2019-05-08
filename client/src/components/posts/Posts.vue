<template>

  <v-container grid-list-xl fluid>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
      >
        <v-card hover>
          <v-img
            @click="gotToPost(post._id)"
            :src="post.imageUrl"
            height="30vh"
            lazy
          >
          </v-img>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="gray--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="showPostCreator = !showPostCreator"
            >
              <v-icon>{{`keyboard_arrow_${showPostCreator ? 'up': 'down'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Post Creator Title -->
          <v-slide-y-transition>
            <v-card-text
              class="grey lighten-4"
              v-show="showPostCreator"
            >
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="post.createdBy.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{post.createdBy.username}}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weight-thin">Added {{post.createdDate}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Load More Button -->
    <v-layout column v-if="showMoreEnabled">
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn
            color="info"
            @click="showMorePosts"
            v-if="showMoreEnabled"
          >
            Load More
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from '../../queries.js'

const pageSize = 2

export default {
  name: 'Post',
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false,
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize,
      }
    }
  },
  methods: {
    gotToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    },
    showMorePosts() {
      this.pageNum += 1
      // Fetch more data and transform the original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // Incrementing pageNum by 1
          pageNum: this.pageNum,
          pageSize,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          console.log('prevResult', prevResult.infiniteScrollPosts.posts)
          console.log('fetchMoreResult', fetchMoreResult)

          const newPosts = fetchMoreResult.infiniteScrollPosts.posts
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore
          this.showMoreEnabled = hasMore

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with new posts
              posts: [
                ...prevResult.infiniteScrollPosts.posts,
                ...newPosts,
              ],
              hasMore,
            }
          }
        },
      })
    }
  }
}
</script>