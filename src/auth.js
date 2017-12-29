
export default {
  loggedIn() {
    return localStorage.getItem('token', token => !!token);
  },
  logout() {
    localStorage.removeItem('token');
  },
};
