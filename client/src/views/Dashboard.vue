<template>
  <div class="crud-app">
    <h1>Post Management</h1>

    <!-- Create Post Form -->
    <div class="form-container">
      <h2>{{ editMode ? "Edit Post" : "Create Post" }}</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="content">Post Content:</label>
          <textarea id="content" v-model="post.content" required></textarea>
        </div>
        <button type="submit">{{ editMode ? "Update Post" : "Create Post" }}</button>
        <button v-if="editMode" type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>

    <!-- Post List -->
    <div class="post-list">
      <h2>All Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post._id">
          <p><strong>Content:</strong> {{ post.content }}</p>
          <p><strong>Created By:</strong> {{ post.createdBy }}</p>
          <p><strong>Created At:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>
          <p><strong>Updated By:</strong> {{ post.updatedBy || "N/A" }}</p>
          <p><strong>Updated At:</strong> {{ post.updatedAt ? new Date(post.updatedAt).toLocaleString() : "N/A" }}</p>
          <button @click="editPost(post)">Edit</button>
          <button @click="deletePost(post._id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      posts: [],
      post: {
        content: "",
      },
      editMode: false,
      editPostId: null,
      token: "", // Replace with actual JWT token
    };
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await api.get("/api/posts", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.posts = response.data.posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    async handleSubmit() {
      if (this.editMode) {
        this.updatePost();
      } else {
        this.createPost();
      }
    },
    async createPost() {
      try {
        const response = await api.post(
          "/api/posts",
          { content: this.post.content },
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.posts.push(response.data.post);
        this.post.content = "";
      } catch (error) {
        console.error("Error creating post:", error);
      }
    },
    async updatePost() {
      try {
        const response = await api.put(
          `/api/posts/${this.editPostId}`,
          { content: this.post.content },
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        const index = this.posts.findIndex((p) => p._id === this.editPostId);
        if (index !== -1) this.posts[index] = response.data.post;
        this.post.content = "";
        this.editMode = false;
        this.editPostId = null;
      } catch (error) {
        console.error("Error updating post:", error);
      }
    },
    editPost(post) {
      this.editMode = true;
      this.editPostId = post._id;
      this.post.content = post.content;
    },
    cancelEdit() {
      this.editMode = false;
      this.editPostId = null;
      this.post.content = "";
    },
    async deletePost(postId) {
      try {
        await api.delete(`/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.posts = this.posts.filter((p) => p._id !== postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
.crud-app {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
.form-container {
  margin-bottom: 20px;
}
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
button {
  margin-right: 10px;
}
.post-list ul {
  list-style: none;
  padding: 0;
}
.post-list li {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
