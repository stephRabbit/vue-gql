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

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        description
        createdDate
        likes
        createdBy {
          _id
          username
          avatar
        }
        messages {
          _id
        }
      }
    }
  }
`

// Mutations
export const SIGN_IN_USER = gql`
  mutation($username: String!, $password: String!) {
    signInUser(username: $username, password: $password) {
      token
    }
  }
`

export const SIGN_UP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`

export const ADD_POST = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
      createdDate
    }
  }
`
