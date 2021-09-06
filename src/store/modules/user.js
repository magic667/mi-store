export default {
  state: {
    // 登录的用户
    user: "",
    // 用于控制是否显示登录组件
    showLogin: false,
    // 控制详情页喜欢按钮是否被按下
    myCollect: [],
    like: []
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getShowLogin(state) {
      return state.showLogin;
    },
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setShowLogin(state, data) {
      state.showLogin = data;
    },
    setMyCollect(state, data) {
      state.myCollect = data;
    },
    // 根据后台收藏数据更新喜欢按钮颜色
    changeMyLikeType(state) {
      for (let i of state.myCollect) {
        const temp = i;
        // 收藏数据存在此id，而且like数组中不包含此id，将此id装入like数组
        if (temp.product_id && !state.like.includes(temp.product_id)) {
          state.like.push(temp.product_id);
        }
      }
    },
    addMyLikeType(state, data) {
      state.like.push(data);
    },
    deleteMyLikeType(state, data) {
      let index = state.like.indexOf(data);
      state.like.splice(index, 1);
    },
  },
  actions: {
    setUser({ commit }, data) {
      commit('setUser', data)
    },
    setShowLogin({ commit }, data) {
      commit('setShowLogin', data)
    },
    setMyCollect({ commit }, data) {
      commit('setMyCollect', data)
    },
    changeMyLikeType({ commit }) {
      commit('changeMyLikeType')
    },
    addMyLikeType({ commit }, data) {
      commit('addMyLikeType', data)
    },
    deleteMyLikeType({ commit }, data) {
      commit('deleteMyLikeType', data)
    },
  }
}
