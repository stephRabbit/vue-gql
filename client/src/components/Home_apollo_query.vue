<template>
  <v-container>
    <h1>Home</h1>
    <div v-if="$apollo.loading">Loading...</div>

    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: { loading, error, data, networkStatus } }">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">ERROR!!</div>
        <div v-else-if="!loading">Network Status {{networkStatus}}</div>
        <ul
          v-else
          v-for="post in data.getPosts"
          :key="post._id"
        >
          <li>
            title: {{post.title}}
            image: {{post.imageUrl}}
            description: {{post.description}}
          </li>
        </ul>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
import { gql } from 'apollo-boost'

export default {
  //name: 'home',

  // data() {
  //   return {
  //     getPostsQuery: gql`
  //       query {
  //         getPosts {
  //           _id
  //           title
  //           imageUrl
  //           description
  //         }
  //       }
  //     `
  //   };
  // },

  // apollo: {
  //   getPosts: {
  //     query: gql`
  //       query {
  //         getPosts {
  //           _id
  //           title
  //           imageUrl
  //           description
  //         }
  //       }
  //     `,
  //     /**
  //      * args - {}
  //      * data, loading, networkStatus, stale
  //      */
  //     result({ data, loading, networkStatus }) {
  //       if (!loading) {
  //         this.post = data.getPosts
  //         console.log('[networkStatus]', networkStatus)
  //       }
  //     },
  //     error(err) {
  //       console.error('[ERROR!!]', err)
  //       console.dir(err)
  //     }
  //   }
  // }
}
</script>
