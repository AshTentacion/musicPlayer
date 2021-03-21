<template>
  <div id="app">
    <transition name="show">
      <div v-show="isShowIndex" class="index">
        <AsideMenu v-show="isShowAsideMenu"></AsideMenu>
        <Header></Header>
        <router-view></router-view>
        <VFooter></VFooter>
      </div>
    </transition>
    <transition name="showIndex">
        <Play v-show="!isShowIndex"></Play>
    </transition>
    <audio :src="audio.src || (musicData[0]&&musicData[0].src) || defaultSrc" :autoplay="isPlaying" ref="audio"></audio>
  </div>
</template>

<script>
import Header from './components/Header'
import AsideMenu from './components/AsideMenu'
import VFooter from './components/Footer'
import Play from './components/Play'
import {mapState} from 'vuex'
export default {
  name: 'app',
  components: {
    Header,
    AsideMenu,
    VFooter,
    Play
  },
  created () {
    this.$store.dispatch('getData')
  },
  mounted () {
    this.$store.commit('findDOM', {name: 'audio', dom: this.$refs.audio})
    this.$refs.audio.addEventListener('ended', () => {
      console.log(this)
      this.next()
    })
    this.$refs.audio.addEventListener('error', () => { this.next() })
  },
  data () {
    return {
      defaultSrc: 'D:\\music\\thank u, next -Ariana Grande\\7 rings.flac'
    }
  },
  computed: {
    ...mapState({
      isShowAsideMenu: state => state.basicStore.isShowAsideMenu,
      audio: state => state.basicStore.audio,
      DOM: state => state.basicStore.DOM,
      isPlaying: state => state.basicStore.isPlaying,
      musicData: state => state.basicStore.musicData,
      isShowIndex: state => state.basicStore.isShowIndex
    })
  },
  methods: {
    next () {
      this.audio.index = this.audio.index === this.musicData.length - 1 ? 0 : (++this.audio.index)
      this.$store.commit('toggleMusic', this.audio.index)
    }
  }
}
</script>

<style lang="scss">
@import "./common/style/base.scss";

  #app, .index{
    position: relative;
    display: flex;
    flex-direction: column;
    width:100%;
    height: 100%;
  }
</style>
