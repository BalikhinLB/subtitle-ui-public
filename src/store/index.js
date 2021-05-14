import Vue from "vue";
import Vuex from "vuex";
import authStore from "./modules/authStore";
import uploadDialogStore from "./modules/uploadDialogStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    authStore,
    uploadDialogStore
  },
  
});
