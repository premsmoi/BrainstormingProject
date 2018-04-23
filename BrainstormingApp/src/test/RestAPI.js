import RestClient from 'react-native-rest-client';
 
export default class RestAPI extends RestClient {
  constructor () {
    // Initialize with your base URL 
    super('http://10.0.2.2:8080');
  }
  // Now you can write your own methods easily 
  login (username, password) {
    // Returns a Promise with the response. 
    //console.log("Login!!!");
    return this.POST('/login', { username, password });
  }
  getCurrentUser () {
    // If the request is successful, you can return the expected object 
    // instead of the whole response. 
    return this.GET('/user')
      .then(response => response.user);
  }
};