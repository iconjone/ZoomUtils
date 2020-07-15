import Vue from 'vue';
import App from './App';
import store from '../store';
import router from './router';
import Vuetify from "vuetify";

   Vue.use(Vuetify);

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  vuetify: new Vuetify(),
  render: h => h(App),
});
