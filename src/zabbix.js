import axios from 'axios';

const apiSuffix = 'api_jsonrpc.php';

export default function client(url, user, password) {
  if (url && url.indexOf('http') !== 0) url = `http://${url}`; /* eslint no-param-reassign: 0 */

  this.url = `${url}/${apiSuffix}`;
  this.user = user;
  this.password = password;
  this.auth = null;
  this.method = 'POST';
  this.id = 1;
  this.call = (method, params) => {
    const options = {
      url: this.url,
      method: this.method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        auth: this.auth,
        id: this.id,
        jsonrpc: '2.0',
        method,
        params,
      },
    };

    return axios(options);
  };

  this.login = function login() {
    return this.call('user.login', {
      user: this.user,
      password: this.password,
    }).then((res) => {
      if (res.data.error) throw new Error(res.data.error.data);

      this.auth = res.data.result;
      return this.auth;
    }).catch((error) => {
      throw error;
    });
  };

  this.logout = () => new Promise((resolve, reject) => {
    this.call('user.logout', []).then((body) => {
      this.auth = body.result;
      resolve('Logged out');
    }).catch(error => reject(error));
  });
}
