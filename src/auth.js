
export default {
  loggedIn() {
    return localStorage.getItem('token', token => !!token);
  },
};
