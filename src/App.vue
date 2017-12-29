<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="/">Zabbix PWA</a>
      <button class="btn btn-outline-light" v-if="loggedIn()" @click="logout()">Logout</button>
    </nav>
    <main>
      <!-- <img src="./assets/logo.png" alt="Vue.js PWA"> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
// import blaze from 'blaze';
import 'bootstrap/dist/css/bootstrap.min.css';
import auth from '@/auth';

export default {
  name: 'app',
  methods: {
    loggedIn() {
      return auth.loggedIn();
    },
    logout() {
      auth.logout();
      this.$router.replace('/login');
    }
  }
};
</script>

<style>
main {
  /* margin-top: 40px; */
}

/* body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
} */
</style>
