<template>
  <v-app id="Words">
      <v-data-table
        must-sort
        :headers="headers"
        fixed-header
        height="100%"
        disable-pagination
        :options.sync="options"
        :hide-default-footer="false"
        :items="words"
        :server-items-length = "serverItemsLength"
        :footer-props = "{'items-per-page-options': [1,25,50,100]}"
        class="elevation-1"
        @dblclick:row="handleClickByRow"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mx-0" :hidden="item.known" @click="setKnown(item, true)">
            mdi-check-underline-circle-outline
          </v-icon>
          <v-icon  class="mx-0" :hidden="!item.known" @click="setKnown(item, false)">
            mdi-cancel
          </v-icon>
        </template>

      </v-data-table>
      <!--------- dialog with word details ---------->
      <v-dialog
        v-model="wordDetailsDialog"
        max-width="900"
      >
      <v-card>
        <v-card-title>
        <v-row>
          <v-col cols = auto>
            <v-card-text class="headline">{{ wordDetails.word }}</v-card-text>
          </v-col>
          <v-spacer/>
          <v-col cols = auto>
            <v-card-actions>
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="setIgnored">
              <v-icon left dark>mdi-close-circle-outline</v-icon>
              SIMPLE
            </v-btn>
              <v-btn v-if = "!wordDetails.known"
                  color="blue-grey"
                  class="ma-2 white--text"
                  @click="setKnown(wordDetails,true)">
                <v-icon left dark>mdi-check-circle-outline</v-icon>
                KNOWN
              </v-btn>
              <v-btn v-else
                     color="blue-grey"
                     class="ma-2 white--text"
                     @click="setKnown(wordDetails,false)">
                <v-icon left dark>mdi-check-circle-outline</v-icon>
                UNKNOWN
              </v-btn>
              <v-btn
                  color="blue-grey"
                  class="ma-2 white--text"
                  @click="editDescription">
                <v-icon left dark>mdi-pencil</v-icon>
                DESCRIPTION
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        </v-card-title>
        <v-card-text>
          Sentences:
          <li v-for="item in wordDetails.sentences">
            {{ item }}
          </li>
          <v-card v-if = "wordDetails.translate">
            <v-card-text v-if = "wordDetails.translate.transcription">
              transcription: [{{wordDetails.translate.transcription}}]
            </v-card-text>
            <v-card-text>
              description: {{wordDetails.translate.description}}
            </v-card-text>

          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              @click="wordDetailsDialog = false"
          >
            <v-icon left dark>mdi-close-circle-outline</v-icon>
            CLOSE</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      <!---------- dialog with edition description -------->
      <v-dialog
          v-model="wordEditionDialog"
          persistent
          max-width="900"
      >
        <v-card>
          <v-card-title>
          <v-row>
          <v-col cols = auto>
            <v-card-text class="headline">{{ wordEditedDetails.word }}</v-card-text>
          </v-col>
          <v-spacer/>
          <v-col cols = auto>
            <v-card-actions>
              <v-btn
                  color="red"
                  class="ma-2 white--text"
                  :hidden="!wordEditedDetails.userDictWord"
                  @click="deleteUserDescription">
                <v-icon left dark>mdi-delete-outline</v-icon>
                DELETE
              </v-btn>
            </v-card-actions>
          </v-col>
          </v-row>
          </v-card-title>
          <v-card-text>
              <v-text-field
                  outlined
                  v-model="wordEditedDetails.transcription"
                  :counter="10"
                  label="transcription"
                  required
              ></v-text-field>
              <v-textarea
                  outlined
                  name="input-7-1"
                  label="description"
                  v-model = wordEditedDetails.description
              ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="blue-grey"
                class="ma-2 white--text"
            @click="saveNewDescription"
            >
              <v-icon left dark>mdi-check-circle-outline</v-icon>
              SAVE</v-btn>
            <v-btn
                color="blue-grey"
                class="ma-2 white--text"
            @click="cancelEditDescription"
            >
              <v-icon left dark>mdi-close-circle-outline</v-icon>
              CANCEL</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
    <v-bottom-navigation app horizontal height="40">
            <v-select
                v-model = "known"
                color="blue-grey"
                class="select white--text"
                outlined
                dense
                :items="knownStates"
                @input="retrieveWords"
            >
            </v-select>
      <v-spacer/>
      <v-btn @click="retrieveWords">
        <span>Refresh</span>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import WordsService from "../../servises/words.servise";
import router from "@/router";
import {performLogout} from "@/util/utils";
import store from "@/store";

export default {
    data(){
        return{
          options:{
            page : 1,
            sortBy : ['word'],
            sortDesc: [false],
            itemsPerPage:25
          },
          knownStates: ['unknown','known','all'],
          serverItemsLength:0,
          known : 'unknown',
          words: [],
          headers: [
            { text: "Word", align: "left", class: 'sticky-header grey lighten-3', sortable: true, value: "word", width: '200px'},
            { text: "Tags", align: 'center', class: 'sticky-header grey lighten-3', value: "tags", width: '200px'},
            { text: "Count", align: 'center', class: 'sticky-header grey lighten-3', value: "count", width: '80px'},
            { text: "Description", align: 'center', class: 'sticky-header grey lighten-3', value: "description", sortable: false, width: '200px' },
            { text: "Actions", align: 'center',color:"deep-purple", class: 'sticky-header grey lighten-3', value: "actions", sortable: false , width: '150px'},
          ],
          wordDetailsDialog: false,
          wordDetails: {},
          wordEditedDetails: {},
          wordEditionDialog: false,
          currentPage: {
            name: "words",
            main: true,
            home: true
          },
        }
    },
    watch: {
      options: {
        handler () {
          this.retrieveWords();
        },
        deep: true,
      },
    },

    methods: {
      logout() {
        performLogout();
        router.replace("/login");
      },
      editDescription(){
        this.wordEditionDialog = true;
        this.wordDetailsDialog = false;
        this.wordEditedDetails = {"id" : this.wordDetails.id,
                                  "word" : this.wordDetails.word,
                                  "transcription" : this.wordDetails.translate.transcription,
                                  "description" : this.wordDetails.translate.description,
                                  "userDictWord" : this.wordDetails.userDictWord};
      },
      deleteUserDescription(){
        this.wordEditionDialog = false;
        WordsService.deleteUserDescription(this.wordEditedDetails.id)
          .then(() => this.retrieveWords())
          .catch((e) => console.log(e));
      },
      saveNewDescription(){
        WordsService.saveNewDescription(this.wordEditedDetails)
            .then(() => {
              this.wordEditionDialog = false;
              this.retrieveWords();
            })
            .catch((e) => console.log(e));
      },
      cancelEditDescription(){
        this.wordEditionDialog = false;
        this.wordDetailsDialog = true;
      },
      setKnown(word, known){
        WordsService.setWordKnown(word.id, known)
            .then(() => {
              this.wordDetails = {};
              this.wordDetailsDialog = false;
              this.retrieveWords();
            })
            .catch((e) => console.log(e));
      },
      setIgnored(){
        WordsService.setWordSimple(this.wordDetails.id)
            .then(() => {
              this.wordDetails = {};
              this.wordDetailsDialog = false;
              this.retrieveWords();
            })
            .catch((e) => console.log(e));
      },
      getRequestParams() {
        let params = {};
        if (this.options.page) {
          params["page"] = this.options.page - 1;
        }

        if (this.options.itemsPerPage) {
          params["size"] = this.options.itemsPerPage;
        }
        switch (this.known) {
          case "unknown": params["known"] = false;
          break;
          case "known": params["known"] = true;
          break;
          default : break;
        }

        if (!this.options.sortBy.empty) {
          params["sort"] = this.options.sortBy[0];
          params["sortDesc"] = this.options.sortDesc[0];
        }

        return params;
      },
      retrieveWords() {
        const params = this.getRequestParams();

        WordsService.getWords(this.$route.meta.fileId, params)
            .then((response) => {
              this.updateFromResponse(response);
            })
            .catch((e) => {
              console.log(e);
            });
      },
      updateFromResponse(response){
        const {totalItems, currentPage, words} = response.data;
              this.options.page = currentPage + 1;
              this.serverItemsLength = totalItems;
              this.words = words;
              for (let i =0; i < this.words.length; i++) {
                this.words[i].userDictWord = this.words[i].userDictionaryWord ? true : false;
                this.words[i].translate = this.words[i].userDictionaryWord ? this.words[i].userDictionaryWord : this.words[i].stardictWord;
                this.words[i].sentences = this.words[i].sentences.map(function(obj){
                                                                          return obj.sentence;
                                                                        });
                this.words[i].description = this.words[i].translate && this.words[i].translate.description?
                                this.words[i].translate.description.substring(0, 50) + '...' : "";
              }
      },
      handleClickByRow(event, row){
         this.wordDetails = row.item;
         this.wordDetailsDialog = true;
      }

    },
    mounted() {
      store.commit("setCurrentPage", this.currentPage);
      const params = this.getRequestParams();
      WordsService.getWords(this.$route.meta.fileId, params).then((response) => {
        this.updateFromResponse(response);
      }).catch((e)=> {
        console.log(e);
        router.replace("/");
      });
    }
};
</script>

<style scoped>
.v-data-table /deep/ .sticky-header {
  opacity: 100;
  position: sticky;
  top: 48px;
}
.v-data-table /deep/ .v-data-footer {
  position: sticky;
  bottom: 40px;
  width: 100%;
  background: white;
}

.v-data-table /deep/ .v-data-table__wrapper {
  overflow: unset;
}
.select {
  max-height: 38px;
  max-width: 150px;
  background-color: white;
  color: white;
  font-size: small;
}

</style>