const mongoose = require('mongoose')
const md5 = require('md5')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'Post'
  }
})

/**
 * Pre-save hooks
 */
userSchema.pre('save', function(next) { // Add avatar for user
  this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`
  next()
})

userSchema.pre('save', function(next) { // Hash password
  // Check if password is not modified
  if (!this.isModified('password')) {
    return next()
  }

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }

    // Generate hash
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }

      // Set password to generated hash
      this.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('User', userSchema)
