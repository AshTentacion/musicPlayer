import VueAxios from 'vue-axios'
import Vue from 'vue'
import axios from 'axios'
Vue.use(VueAxios, axios)

const store = {
  state: {
    isShowAsideMenu: false,
    isShowMiniMusic: true,
    isShowIndex: true,
    skinColor: localStorage.skinColor || '#B72712',
    musicData: [],
    isPlaying: false,
    DOM: {},
    audio: {
      name: '',
      src: '',
      musicImgSrc: '',
      index: 0
    }
  },
  mutations: {
    changeShowAsideMenu (state, flag) {
      state.isShowAsideMenu = flag
    },
    changeShowMiniMusic (state, flag) {
      state.isShowMiniMusic = flag
    },
    changeSkinColor (state, color) {
      state.skinColor = color
    },
    changeShowIndex (state, flag) {
      state.isShowIndex = flag
    },
    findDOM (state, payload) {
      state.DOM[payload.name] = payload.dom
    },
    toggleMusic (state, index) {
      state.audio.name = state.musicData[index].name
      state.audio.src = state.musicData[index].src
      state.audio.musicImgSrc = state.musicData[index].musicImgSrc
      state.audio.index = index
    },
    play (state, flag) {
      state.isPlaying = flag
    },
    del (state, index) {
      if (state.musicData.length === 0) {
        return
      }
      state.musicData.splice(index, 1)
    }
  },
  actions: {
    getData ({commit, state}) {
      if (localStorage.musics !== '[]' && localStorage.musics) {
        state.musicData = JSON.parse(localStorage.musics)
      }
      return new Promise((resolve, reject) => {
        Vue.axios
          .get('/api/music-data')
          .then((res) => {
            console.log(res)
            if (res.data.errno === 0) {
              state.musicData = res.data.musicData
              localStorage.musics = JSON.stringify(state.musicData)
            }
          })
          .then(() => {
            commit('toggleMusic', 0)
          })
        resolve()
      })
    }
  }
}

export default store
