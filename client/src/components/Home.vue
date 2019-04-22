<template>
  <v-container>
    <h1>Home</h1>
    <v-btn color="accent">Button</v-btn>
    <ul v-for="post in getPosts" :key="post._id">
      <li>
        title: {{post.title}}
        image: {{post.imageUrl}}
        description: {{post.description}}
      </li>
    </ul>
  </v-container>
</template>

<script>
import { gql } from 'apollo-boost'

export default {
  name: 'home',
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
          }
        }
      `
    }
  }
}
</script>
