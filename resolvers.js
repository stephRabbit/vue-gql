const bcyrpt = require('bcrypt')

module.exports = {
  Query: {
    /**
     * @params _ - object that contains the result returned from the resolver on the parent field - root
     * @params args - argument passed form typeDefs
     * @params context - Models
     * @params info - contains information about the execution state of the query, including the field name, path to the field from the root ...
     */
    getPosts: async (_, agrs, { Post }, info) => {

      const post = await Post.find({})
        .sort({ createdDate: 'desc' })
        .populate({ // turn objectID from createdBy: { ..., ref: "User" } and convert to User object
          path: 'createdBy',
          model: 'User'
        })

      return post
    }
  },

  Mutation: {
    /**
     * @params _ - object that contains the result returned from the resolver on the parent field - root
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

        return user
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

        return newUser
      } catch (err) {
        throw new Error(`Error: ${err}`)
      }
    },
  }
}
