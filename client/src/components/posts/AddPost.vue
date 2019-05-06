<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >
    <!-- Page title -->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <h1 color="primary--text">Add Post</h1>
      </v-flex>
    </v-layout>

    <!-- Add post form -->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <v-form
          lazy-validation
          ref="form"
          @submit.prevent="handleAddPost"
          v-model="isFormValid"
        >
          <!-- Title input -->
          <v-layout>
            <v-flex xs12>
              <v-text-field
                required
                label="Title"
                type="text"
                v-model="title"
                :rules="titleRules"
              >
              </v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image url input -->
          <v-layout>
            <v-flex xs12>
              <v-text-field
                required
                label="Link to image"
                type="text"
                v-model="imageUrl"
                :rules="imageUrlRules"
              >
              </v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image preview -->
          <v-layout v-if="imageUrl">
            <v-flex xs12>
              <img :src="imageUrl" height="300">
            </v-flex>
          </v-layout>

          <!-- Category select -->
          <v-layout>
            <v-flex xs12>
              <v-select
                multiple
                :items="categoryList"
                :rules="categoryListRules"
                v-model="categories"
                label="Categories"
              >
              </v-select>
            </v-flex>
          </v-layout>

          <!-- Description input -->
          <v-layout>
            <v-flex xs12>
              <v-textarea
                required
                label="Description"
                type="text"
                v-model="description"
                :rules="descriptionRules"
              >
              </v-textarea>
            </v-flex>
          </v-layout>

          <!-- Submit post -->
          <v-layout>
            <v-flex xs12>
              <v-btn
                color="info"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid || loading"
              >
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                Add Post
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddPost',
  data() {
    return {
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      categoryList: [
        'Art',
        'Education',
        'Food',
        'Furniture',
        'Photography',
        'Science',
        'Technology',
        'Travel',
      ],
      titleRules: [
        title => !!title || 'Title is required',
        title => title.length <= 25 || 'Title must be less than 25 characters',
      ],
      imageUrlRules: [
        imageUrl => !!imageUrl || 'Image link is required',
      ],
      categoryListRules: [
        categories => categories.length > 0 || 'Category is required',
      ],
      descriptionRules: [
        description => !!description || 'Description is required',
        description => description.length <= 200 || 'Description must be less than 200 characters',
      ],
    }
  },
  computed: {
    ...mapGetters(['loading', 'user']),
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        })
        this.$router.push('/')
      }
    }
  }
}
</script>

