// class ApiResponse {
//   constructor(data, statuscode, message = "success") {
//     this.data = data;
//     this.statuscode = statuscode;
//     this.message = message;
//     this.success = statuscode < 400;
//   }
// }
class ApiResponse {
  constructor(statuscode, data, message = "success") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400;
  }
}

export { ApiResponse };
