import http from "../http/httpResource";

const API_FILE = "/api/user/files/words/"
const ADMIN_API = "/api/admin/words/"
const APT_DESCRIPTION = "/api/user/dictionary/"

class WordsService {
  getWords(id, params) {
    return http.get(API_FILE+id, {params});
  }
  setWordSimple(id){
    return http.post(ADMIN_API + "toignored/" + id);
  }
  setWordKnown(id, known){
    return http.put(API_FILE + id + '/' + known);
  }
  saveNewDescription(description){
    return http.put(APT_DESCRIPTION + description.id, description);
  }
  deleteUserDescription(id){
    return http.delete(APT_DESCRIPTION + id);
  }
}

export default new WordsService();