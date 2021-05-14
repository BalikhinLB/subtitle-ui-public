<template>
  <div id="Home">
    <v-container fill-height fluid>
      <v-row fill-height class="grey lighten-1">
        <v-col cols="12">
          <!--------------- dialog for upload ------------------->
          <v-dialog v-model="uploadDialog" max-width="650">
            <v-card>
              <v-card-title class="headline"> Upload file</v-card-title>
              <v-card-text> File shoud be less then 500kB. TXT or SRT.</v-card-text>
              <v-card-actions v-if="currentFile">
                <div
                    class="progress-bar progress-bar-info progress-bar-striped"
                    role="progressbar"
                    :aria-valuenow="progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="{ width: progress + '%' }"
                >
                  {{ progress }}%
                </div>
              </v-card-actions>
              <v-card-actions>
                <v-row align="center">
                  <v-col cols="12">
                    <v-file-input v-model="selectedFiles"
                                  show-size
                                  label="File input"
                                  @change="selectFile"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-card-actions>
                <v-btn
                    color="blue-grey"
                    :disabled="!canUpload"
                    @click="upload"
                    class="ma-2 white--text"
                >
                  Upload
                  <v-icon right dark> mdi-cloud-upload</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!---------------------------------------------------------------------->
          <v-card flat>
            <v-col cols="12">
              <v-row>
                <v-col cols="8">
                  <v-card-text>You can upload files here</v-card-text>
                </v-col>
                <v-col cols="4">

                  <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        color="blue-grey"
                        class="ma-2 white--text"
                        @click="uploadDialog = true">
                      <v-icon left dark>mdi-cloud-upload-outline</v-icon>
                      Upload
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
          <v-card v-if="fileInfos.length > 0" flat>
            <v-col cols="12">
                            <v-list two-line subheader>
                              <v-list-item v-for="fileInfo in fileInfos" :key="fileInfo.id">
                                <v-list-item-avatar>
                                  <v-progress-circular
                                      v-if="isLoaded(fileInfo)"
                                      indeterminate
                                      color="primary"
                                  ></v-progress-circular>
                                  <v-icon v-else :class="iconClassByState(fileInfo)"
                                  >{{ iconState(fileInfo) }}
                                  </v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                  <v-list-item-title
                                      v-text="fileInfo.filename"
                                  ></v-list-item-title>
                                  <v-list-item-subtitle>{{
                                      fileInfo.type
                                    }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                  <v-row>
                                    <v-btn icon ripple>
                                      <v-icon
                                          color="grey lighten-1"
                                          @click="goToFileWords(fileInfo)"
                                      >
                                        mdi-arrow-right-bold-circle-outline
                                      </v-icon>
                                    </v-btn>
                                    <v-btn icon ripple :disabled="isLoaded(fileInfo)" @click="deleteFile(fileInfo)">
                                      <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
                                    </v-btn>
                                  </v-row>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
            </v-col>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
    <v-bottom-navigation app horizontal height="36">
      <v-btn @click="getFiles">
        <span>Refresh</span>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import router from '../../router';
import FileService from "../../servises/file.servise";
import {performLogout} from "@/util/utils";
import store from "@/store";

export default {
  name: "Home",
  data() {
    return {
      uploadDialog: false,
      file: undefined,
      canUpload: false,
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
      currentPage: {
        name: "home",
        main: true,
        home: false
      },
      timer: ''
    };
  },
  methods: {
    logout() {
      performLogout();
      router.replace("/login");
    },
    isLoaded(fileInfo) {
      return fileInfo.state === 'LOADED'
    },
    iconState(fileInfo) {
      switch (fileInfo.state) {
        case "COMPLETED":
          return "mdi-check-decagram-outline";
        case "ERROR":
          return "mdi-alert-decagram-outline";
        default:
          return "mdi-skull-crossbones-outline";
      }
    },
    iconClassByState(fileInfo) {
      switch (fileInfo.state) {
        case "COMPLETED":
          return "green lighten-1 white--text";
        case "ERROR":
          return "red lighten-1 white--text";
        default:
          return "red lighten-1 white--text";
      }
    },
    selectFile(file) {
      this.currentFile = file;
      if (this.currentFile && this.currentFile.size < 1024 * 1024) {
        this.canUpload = true;
      } else {
        this.canUpload = false;
      }
      this.progress = 0;
    },
    emptyFile() {
      this.canUpload = false;
    },
    getFiles() {
      FileService.getFiles().then((response) => {
        this.fileInfos = response.data;
      }).catch((e) => console.log(e));
    },
    autoRefresh(){
      this.getFiles();
      let needStop = true;
      for (let i =0; i < this.fileInfos.length; i++) {
         if (this.fileInfos[i].state === 'LOADED') {
           needStop = false;
           break;
         }
      }
      if (needStop) clearInterval(this.timer);
    },
    upload() {
      this.progress = 0;
      if (!this.currentFile) return;
      FileService.upload(this.currentFile, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
          .then((response) => {
            this.message = response.data.message;
            return FileService.getFiles();
          })
          .then((files) => {
            this.fileInfos = files.data;
            this.selectedFiles = undefined;
            this.canUpload = false;
            this.currentFile = undefined;
            this.uploadDialog = false;
            this.timer = setInterval(this.autoRefresh, 2000);
          })
          .catch(() => {
            this.progress = 0;
            this.message = "Could not upload the file!";
            this.currentFile = undefined;
          });
    },
    deleteFile(fileInfo) {
      FileService.deleteFile(fileInfo.id)
          .then((response) => {
            // TODO info wiindow
            return FileService.getFiles();
          })
          .then((files) => {
            this.fileInfos = files.data;
          })
          .catch(() => {
            // TODO info window
          })
    },
    goToFileWords(fileInfo) {
      router.replace("/words").then(this.$route.meta.fileId = fileInfo.id)
    }
  },

  computed: {
    getCurrentUser() {
      return this.$store.getters.getCurrentUser;
    },
  },
  mounted() {
    store.commit("setCurrentPage", this.currentPage);
    if (this.getCurrentUser) {
      FileService.getFiles().then((response) => {
        this.fileInfos = response.data;
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.v-container /deep/ {
  position: sticky;
  top: 48px;
}
</style>