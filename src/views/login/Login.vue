<template>
  
    
        <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
            <div>
                <v-tabs v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
                    <v-tabs-slider color="deep-purple"></v-tabs-slider>
                    <v-tab v-for="(i, index) in tabs" :key="index">
                        <v-icon large>{{ i.icon }}</v-icon>
                        <div class="caption py-1">{{ i.name }}</div>
                    </v-tab>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="loginForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginForm.login" :rules="[rules.requiredName]" label="Username" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginForm.password" :append-icon="show1?'mdi-eye':'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 5 characters" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                            <v-btn x-large block :disabled="!valid" color="success" @click="login"> Login </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="registerForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="signupForm.login" :rules="[rules.requiredName]" label="Username" maxlength="25" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="signupForm.email" :rules="emailRules" label="E-mail" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="signupForm.password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 5 characters" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Confirm Password" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block :disabled="!valid" color="success" @click="signup">Register</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </div>
        </v-dialog>
   

</template>

<script>
import httpResource from "../../http/httpResource";
import router from "../../router/index";
import {
  parseApierror,
  performLogout,
  getAuthenticatedUser,
} from "../../util/utils";

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        login: "",
        password: "",
      },
      signupForm: {
        login: "",
        email: "",
        password: "",
      },
      displayErrorMessage: false,
      errorMessage: "",
      loginInProcess: false,
      dialog: true,
      tab: 0,
      tabs: [
        { name: "Login", icon: "mdi-account" },
        { name: "Register", icon: "mdi-account-outline" },
      ],
      valid: true,

      verify: "",

      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        requiredName: (value) => {
          if (!value) {
            return "Required.";
          } else {
            if (/\s/.test(value)) {
              return 'Remove spaces, please';
            }
            return true;
            //(value.contain(' ') ? true : 'Remove spaces, please');
          }

        },
        min: (v) => (v && v.length >= 5) || "Min 5 characters",
      },
    };
  },
  computed: {
    passwordMatch() {
      return () =>
        this.signupForm.password === this.verify || "Password must match";
    },
  },
  methods: {
    async login() {
      this.loginInProcess = true;
      let canNavigate = false;
      const loginRequest = {
        login: this.loginForm.login,
        password: this.loginForm.password,
      };
      try {
        const response = await httpResource.post(
          "api/auth/login",
          loginRequest
        );
        if (response.status === 200) {
          await getAuthenticatedUser();
          canNavigate = true;
        }
      } catch (error) {
        performLogout();
        const apierror = parseApierror(error);
        this.displayErrorMessage = true;
        this.errorMessage = apierror.message;
      }
      this.loginInProcess = false;

      if (canNavigate) {
        router.replace("/");
      }
    },
    async signup() {
      let canNavigate = false;
      const signupRequest = {
        email: this.signupForm.email,
        password: this.signupForm.password,
        login: this.signupForm.login
      };
      try {
        const response = await httpResource.post(
          "api/auth/signup",
          signupRequest
        );
        if (response.status === 200) {
          canNavigate = true
        } else {
          this.errorMessage = "Error during registration";
        }
      } catch (error) {
        const apierror = parseApierror(error);
        this.displayErrorMessage = true;
        this.errorMessage = apierror.message;
      }
      this.loginInProcess = false;

      if (canNavigate) {
        this.loginForm.email = this.signupForm.email;
        this.loginForm.password = this.signupForm.password;
        this.login();
      }

    },
  },
};
</script>

<style></style>
