<template>
  <div id="app">
    <v-app>
      <v-app-bar app
                 fixed
                 color="deep-purple"
                 dense>
        <v-btn v-if="getCurrentPage.main"
               color="blue-grey"
               class="ma-2 white--text"
               @click="goMain"
        >
          <v-icon left dark>mdi-information-outline</v-icon>
          MAIN
        </v-btn>
        <v-btn v-if="getCurrentPage.home && isAuthenticated"
               color="blue-grey"
               class="ma-2 white--text"
               @click="goHome"
        >
          <v-icon left dark>mdi-home-account</v-icon>
          HOME
        </v-btn>
        <v-spacer/>
        <v-btn v-if="getUsername === NOT_SIGNED"
               color="blue-grey"
               class="ma-2 white--text"
               @click="login"
        >
          <v-icon left dark>mdi-account-arrow-left</v-icon>
          LOGIN
        </v-btn>
        <v-btn v-else
            color="blue-grey"
            class="ma-2 white--text"
            @click="logout"
        >
          <v-icon left dark>mdi-arrow-up-bold-box-outline</v-icon>
          logout
        </v-btn>
      </v-app-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script>

import {performLogout} from "@/util/utils";
import router from "@/router";

export default {
  name: "app",

  data() {
    return {};
  },

  created() {
    this.NOT_SIGNED = "not signed";
  },
  methods:{
    logout(){
      performLogout();
      if (this.getCurrentPage.name !== 'main') router.replace("/");
    },
    login(){
      router.replace("/login");
    },
    goHome(){
      router.replace("/home");
    },
    goMain(){
      router.replace("/main");
    }
  },
  computed: {
    isAuthenticated(){
      return this.$store.getters.getIsAuthenticated;
    },
    getCurrentUser() {
      return this.$store.getters.getCurrentUser;
    },
    getCurrentPage() {
      return this.$store.getters.getCurrentPage;
    },
    getUsername() {
      return this.$store.getters.getCurrentUser.email
          ? this.$store.getters.getCurrentUser.email
          : this.NOT_SIGNED;
    },
  },

};
</script>

<style>

</style>
