const state = {
    upload: false,
  };
  
  const getters = {
    getUpload(state) {
      return state.upload;
    },
  };
  
  const mutations = {
    setUpload(state, upload) {
      state.upload = upload;
    },
  };
  
  const actions = {
    async getUpload({ commit, dispatch }) {},
  };
  
  export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
  };
  