<template>
<div>
  <div class="menu"><router-link to="/"><div>목록</div></router-link></div>
  <div class="post">
    <div class="img"><img :src="img[(post.id * 5 ) % 7 % 3]"></div>
    <div><strong>{{ post.title }}</strong></div>
    <div class="user"><strong>by</strong> <em>{{ post.user.username }} ({{ post.user.email }})</em></div>
    <div class="content">{{ post.body }}</div>
  </div>
  <div class="comments">
    <div class="comments_title">Comments</div>
    <div class="comment" v-for="comment in comments" :key="comment.id">
      <div><strong>{{ comment.name }}</strong></div>
      <div>{{ comment.body }}</div>
      <div><strong>by</strong> <em>{{ comment.email }}</em></div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Post',
  data () {
    return {
      img: [
        'https://via.placeholder.com/150/771796',
        'https://via.placeholder.com/150/92c952',
        'https://via.placeholder.com/150/56a8c0'
      ],
      post: {user: {}},
      comments: [],
      msg: 'Post'
    }
  },
  created () {
    let postId = Number(this.$route.params.postId)
    let posts = this.$store.state.posts
    let _post = posts.find(e => e.id === postId)
    if (_post === undefined) {
      axios.get('https://jsonplaceholder.typicode.com/posts/' + postId)
        .then(response => response.data)
        .then(response => {
          this.post = {...this.post, ...response}

          axios.get('https://jsonplaceholder.typicode.com/users/' + response.userId)
            .then(response => response.data)
            .then(user => {
              this.post['user'] = user
            })
        })
    } else this.post = _post

    axios.get('https://jsonplaceholder.typicode.com/posts/' + postId + '/comments')
      .then(response => response.data)
      .then(comments => {
        comments.reverse()
        this.comments = comments
      })
  },
  mounted () {
    document.title = this.post.title
    let description = document.getElementsByName('description')
    description[0].content = this.post.body
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/style.scss";

img {
  @include border-radius(10px);
}

.menu {
  @include menu();
}

.post {
  padding: 10px;
}

.user {
  text-align: right;
}

.content {
  padding-top: 10px;
}

.comments_title {
  background-color: #777;
  padding: 5px;
  margin: 10px;
  color: #FFFFFF;
}

.comment {
  display: flex;
  flex-direction: column;
  item-aligns: flex-end;
}

.comment:nth-child(odd) {
  background-color: #dfe3e8;
}
</style>
