<template>
  <div id="UnLoginHome">
    <v-card flat>
      <v-card-text>
        <p>Привет!</p>
        Это сайт парсинга субтитров на английском языке.
        Вы можете загрузить субтитры (ну или просто текст), программа найдет в файле все слова,
        отбросит самые простые (be, not и т.п.) и выдаст их список с переводом (если таковой найдется).
        Каждое слово можно посмотреть поближе - в каких предложениях оно встретилось, что означает.
        Пометив слово как известное, в следующем файле, оно сразу будет считаться известным и вам достаточно
        будет просмотреть только новые для вас слова.
        Что бы воспользоваться функционалом необходимо пройти регистрацию.
        <p>Hello!</p>
        Here you can parse subtitles (english) to the words with translate it on Russian.
        <!--После регестрации будет доступна возможность загрузить 1 файл.
        После подтверждения e-mail еще 1. Файлы можно удалять, список известных слов при этом запоминается.
        Для большего количества возможных загружаемых файлов обратитесь к администрации сайта.-->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "UnLoginHome",
  data() {
    return {
    };
  },
  computed: {
    getCurrentUser() {
      return this.$store.getters.getCurrentUser;
    },
    currentPage(){
      let cp = {
        name:"main",
        main: false,
        home: this.isHomeAvailable
      };
      return cp;
    },
    isHomeAvailable(){
      return this.$store.getters.getIsAuthenticated;
    }
  },
  mounted() {
    store.commit("setCurrentPage", this.currentPage);
  }
}

</script>

<style scoped>

</style>