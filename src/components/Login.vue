<template>
  <div>
    <div class="form-group">
      <label for="url">Zabbix URL</label>
      <input type="text" class="form-control" id="url" placeholder="Enter URL of your zabbix instance" v-model="url">
    </div>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" class="form-control" id="username" placeholder="Enter username" v-model="user">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Enter password" v-model="pass">
    </div>

    <div class="alert alert-danger" v-if="alert">{{ alert }}</div>

    <button type="button" class="btn btn-primary" @click="login()">Login</button>
  </div>
</template>

<script>
import Zabbix from '@/zabbix';

export default {
  data: () => ({
    url: '',
    user: '',
    pass: '',
    token: '',
    alert: null,
  }),
  mounted() {
    const t = localStorage.getItem('token');
    if (t) this.token = t;

    const u = localStorage.getItem('zabbix-url');
    if (u) this.url = u;
  },
  methods: {
    login() {
      const zabbix = new Zabbix(this.url, this.user, this.pass);
      zabbix.login().then((token) => {
        localStorage.setItem('zabbix-url', this.url);

        console.log('Logged in', token);
        localStorage.setItem('token', token);
        this.$router.replace('/');
      })
      .catch(err => {
        this.alert = err.message;
      });
    },
  }
};
</script>

<style scoped>
  div {
    padding: 20px;
  }
</style>
