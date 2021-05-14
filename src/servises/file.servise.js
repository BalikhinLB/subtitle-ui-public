import http from "../http/httpResource";

const API_FILE = "/api/user/files/"

class FilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post(API_FILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }
  deleteFile(id){
    return http.delete(API_FILE+id);
  }
  getFiles() {
    return http.get(API_FILE);
  }
}

export default new FilesService();