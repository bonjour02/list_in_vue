<template>
  <div class="main">
    <h1>Posts</h1>
    <div class="tool">
      <select :value="listSize" v-on:change="changeListSize">
        <option v-for="option in listSizeOptions" v-bind:key="option.value" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
      <select :value="listLayout" v-on:change="changeListLayout" class="sel_layout">
        <option v-for="option in listLayoutOptions" v-bind:key="option.value" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div :class="'posts ' + listLayout">
      <div class="post" v-for="post in list" :key="post.id">
        <router-link :to="'/view/' + post.id">
          <div class="img"><img :src="img[(post.id * 5 ) % 7 % 3]"></div>
          <div class="content">
            <div><strong>{{ post.title }}</strong></div>
            <div class="ellipsis">{{ post.body }}</div>
            <div class="name"><strong>by</strong> <em>{{ post.user.name }}</em></div>
          </div>
        </router-link>
      </div>
    </div>
    <div id="more" v-if="more" @click="handleScroll">more</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
let isMobile = !navigator.platform.toLowerCase().match(/win16|win32|win64|mac|macintel/)

export default {
  name: 'Posts',
  data () {
    return {
      isMobile,
      img: [
        'https://via.placeholder.com/150/771796',
        'https://via.placeholder.com/150/92c952',
        'https://via.placeholder.com/150/56a8c0'
      ],
      listSizeOptions: [
        { text: '8개씩 보기', value: 8 },
        { text: '16개씩 보기', value: 16 }
      ],
      listLayoutOptions: [
        { text: '리스트형 보기', value: 'list' },
        { text: '그리드형 보기', value: 'grid' }
      ]
    }
  },
  computed: {
    ...mapState({
      listSize: state => state.listSize,
      listLayout: state => state.listLayout,
      list: state => state.list,
      more: state => state.more
    })
  },
  methods: {
    changeListSize: function (e) {
      this.$store.dispatch('setListSize', e.target.value)

      const storage = window.localStorage
      storage.setItem('listSize', e.target.value)
    },
    changeListLayout: function (e) {
      this.$store.commit('SET_LIST_LAYOUT', e.target.value)

      const storage = window.localStorage
      storage.setItem('listLayer', e.target.value)
    },
    handleScroll: function () {
      if (this.more === true && (window.visualViewport.pageTop + window.visualViewport.height) >= document.body.scrollHeight) {
        this.$store.dispatch('setList')
      }
    }
  },
  mounted () {
    document.title = 'mama'
    let description = document.getElementsByName('description')
    description[0].content = 'posts'

    window.addEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/style.scss";

@mixin grid() {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
}

img {
  @include border-radius(10px);
}

.tool {
  @include menu();
}

select {
  margin-left: 5px;
}

.posts {
  display: grid;
  font-size: $font-default;
}

.a {
  text-decoration:n one;
}

.post {
  padding: 8px 0 5px 0;
  text-decoration: none;
}

.post:hover {
    background-color: #dfe3e8;
    @include border-radius(8px);
}

.content {
  text-decoration: none;
}

#more {
  cursor: pointer;
  background-color: #dfe3e8;
  text-align: center;
  width: 100%;
  padding: 10px;
}

.ellipsis {
        display: inline-block;
        width: 90%;
        height: 3em;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-decoration: none;
}

@media #{map-get($breakpoints, small)} {
  .posts {
    display: inline-block;
  }
  .sel_layout {
    display: none;
  }
}

@media #{map-get($breakpoints, medium)} {
  .posts {
    display: inline-block;
  }
  .sel_layout {
    display: none;
  }
}

@media #{map-get($breakpoints, large)} {
  .list {
    display: inline-block;
  }

  .grid {
    @include grid();
  }
}
</style>
