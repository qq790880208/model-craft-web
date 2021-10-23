const getDefaultState = () => {
<<<<<<< HEAD
    return {
      uuid: '',
      type: '',
      dirPath: '',
      predictcontrol:''
      // dataSet: []
    }
=======
  return {
    uuid: '',
    type: '',
    dirPath: '',
    predictcontrol:''
    // dataSet: []
>>>>>>> dev
  }
}

const state = getDefaultState()

const mutations = {
<<<<<<< HEAD
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_DIRPATH: (state, dirPath) => {
    state.dirPath = dirPath
  },
  SET_PREDICTCONTROL: (state, predictcontrol) => {
    state.predictcontrol = predictcontrol
  }
  // SET_DATASET: (state, dataSet) => {
  //   state.dataSet = dataSet
  // }
  
=======
SET_UUID: (state, uuid) => {
  state.uuid = uuid
},
SET_TYPE: (state, type) => {
  state.type = type
},
SET_DIRPATH: (state, dirPath) => {
  state.dirPath = dirPath
},
SET_PREDICTCONTROL: (state, predictcontrol) => {
  state.predictcontrol = predictcontrol
>>>>>>> dev
}
// SET_DATASET: (state, dataSet) => {
//   state.dataSet = dataSet
// }

}

const actions = {
<<<<<<< HEAD
  changeUuid({ commit }, data) {
    commit('SET_UUID', data)
  },
  changeType({ commit }, data) {
    commit('SET_TYPE', data)
  },
  changeDirPath({ commit }, data) {
    commit('SET_DIRPATH', data)
  },
  changepredictcontrol({ commit }, data) {
    commit('SET_PREDICTCONTROL', data)
  }
  // changeDataSet({ commit }, data) {
  //   commit('SET_DATASET', data)
  // }
=======
changeUuid({ commit }, data) {
  commit('SET_UUID', data)
},
changeType({ commit }, data) {
  commit('SET_TYPE', data)
},
changeDirPath({ commit }, data) {
  commit('SET_DIRPATH', data)
},
changepredictcontrol({ commit }, data) {
  commit('SET_PREDICTCONTROL', data)
}
// changeDataSet({ commit }, data) {
//   commit('SET_DATASET', data)
// }
>>>>>>> dev
}

export default {   
namespaced: true,
state,
mutations,
actions
}
