import { gql } from 'apollo-boost'

// Queries
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
      description
    }
  }
`

// Mutations

