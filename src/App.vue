<template>
  <div id="app">
    <button @click="open">点击查看大图</button>
    <vue-carousel-video
      :visible="carouselVisible"
      @close="carouselClose"
      :slideData="slideData"
      :begin="0"
    ></vue-carousel-video>
  </div>
</template>

<script>
import VueCarouselVideo from './lib/vue-carousel-video'
export default {
  name: 'app',
  data () {
    return {
      carouselVisible: false,
      slideData: [
        {
          type: 'img',
          src: require('./lib/assets/carousel_icon1.png')
        },
        {
          type: 'img',
          src: require('./lib/assets/carousel_icon2.png')
        },
        {
          type: 'video',
          src: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4'
        }
      ]
    }
  },
  methods: {
    carouselClose () {
      this.carouselVisible = false
    },
    open () {
      this.carouselVisible = true
    }
  },
  components: {
    VueCarouselVideo
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
