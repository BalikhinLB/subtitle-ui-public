const state = {
  isAuthenticated: false,
  currentUser: {
    userId: "",
    email: ""
  },
  currentPage: {
    name:"",
    main: false,
    home: true
  },
  intervalName: ""
};

const getters = {
  getIsAuthenticated(state) {
    return state.isAuthenticated;
  },
  getCurrentUser(state) {
    return state.currentUser;
  },
  getIntervalName(state) {
    return state.intervalName;
  },
  getCurrentPage() {
    return state.currentPage;
  }

};

const mutations = {
  setIsAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  setCurrentUser(state, currentUser) {
    state.currentUser.userId = currentUser.userId;
    state.currentUser.email = currentUser.email;
  },
  setIntervalName(state, intervalName) {
    state.intervalName = intervalName;
  },
  clearCurrentUser(state) {
    state.currentUser.userId = "";
    state.currentUser.email = "";
  },
  setCurrentPage(state, page) {
    state.currentPage.name = page.name;
    state.currentPage.main = page.main;
    state.currentPage.home = page.home;
  }
};

const actions = {
  async login({ commit, dispatch }, loginData) {},
  async getCurrentUser({ commit, dispatch }) {},
  async getCurrentPage({commit, dispatch}) {},
  async refresh({ commit, dispatch, getters }) {},
  async logout({ commit, dispatch, getters }) {}
};

export default {
  namespaced: false,
  state,
  getters,
  mutations,
  actions
};
