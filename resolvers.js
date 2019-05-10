require('dotenv').config({ path: 'variables.env' })
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (user, secert, expiresIn) => {
  const { username, email } = user
  return jwt.sign({ username, email }, secert, { expiresIn })
}

module.exports = {
  Query: {
    /**
     * @params _ - { ROOT } object that contains the result returned from the resolver on the parent field - root
     * @params args - argument passed form typeDefs
     * @params context - Models
     * @params info - contains information about the execution state of the query, including the field name, path to the field from the root ...
     */
    getCurrentUser: async (_, agrs, { User, currentUser }, info) => {
      if (!currentUser) {
        return null
      }

      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: 'favorites',
        model: 'Post'
      })

      return user
    },

    getPosts: async (_, agrs, { Post }, info) => {
      const post = await Post.find({})
        .sort({ createdDate: 'desc' })
        .populate({
          // turn objectID from createdBy: { ..., ref: "User" } and convert to User object
          path: 'createdBy',
          model: 'User'
        })

      return post
    },

    getPost: async (_, { postId }, { Post }, info) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: 'messages.messageUser',
        model: 'User'
      })
      return post
    },

    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }, info) => {
      let posts

      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: 'desc' })
          .populate({
            path: 'createdBy',
            model: 'User'
          })
          .limit(pageSize)
      } else {
        const skip = pageSize * (pageNum - 1)
        posts = await Post.find({})
          .sort({ createdDate: 'desc' })
          .populate({
            path: 'createdBy',
            model: 'User'
          })
          .skip(skip)
          .limit(pageSize)
      }

      const totalDocs = await Post.countDocuments()
      const hasMore = totalDocs > pageSize * pageNum

      return {
        posts,
        hasMore
      }
    }
  },

  Mutation: {
    /**
     * @params _ - { ROOT } object that contains the result returned from the resolver on the parent field - root
     * @params args - argument passed form typeDefs
     * @params context - Models
     * @params info - contains information about the execution state of the query, including the field name, path to the field from the root ...
     */

    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post },
      info
    ) => {
      try {
        const newPost = await new Post({
          title,
          imageUrl,
          categories,
          description,
          createdBy: creatorId
        }).save()

        return newPost
      } catch (err) {
        throw new Error(`Error: ${err}`)
      }
    },

    addPostMessage: async (_, { messageBody, userId, postId }, { Post }, info) => {
      const newMessage = {
        messageBody,
        messageUser: userId,
      }

      const post = await Post.findOneAndUpdate(
        { _id: postId },
        // Prepend messages to beginning message array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // Return fresh doument after update
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      })

      // Return first message
      return post.messages[0]
    },

    signInUser: async (_, { username, password }, { User }, info) => {
      try {
        const user = await User.findOne({ username })

        if (!user) {
          throw new Error('User not found!')
        }

        const isValidPassword = await bcyrpt.compare(password, user.password)

        if (!isValidPassword) {
          throw new Error('Invalid password!')
        }

        return { token: createToken(user, process.env.APP_SECERT, '1hr') }
      } catch (err) {
        throw new Error(`Error: ${err}`)
      }
    },

    signUpUser: async (_, { username, email, password }, { User }, info) => {
      try {
        const user = await User.findOne({ username })

        if (user) {
          throw new Error('User already exists!')
        }

        const newUser = await new User({
          username,
          email,
          password
        }).save()

        return { token: createToken(newUser, process.env.APP_SECERT, '1hr') }
      } catch (err) {
        throw new Error(`Error: ${err}`)
      }
    }
  }
}
