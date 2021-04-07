const getDefaultState = () => {
    return {
      uuid: '',
      type: ''
    }
  }
  
const state = getDefaultState()
  
const mutations = {
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_TYPE: (state, type) => {
    state.type = type
  }
}
  
const actions = {
  changeUuid({ commit }, data) {
    commit('SET_UUID', data)
  },
  changeType({ commit }, data) {
    commit('SET_TYPE', data)
  }
}

export default {   
  namespaced: true,
  state,
  mutations,
  actions
}
  