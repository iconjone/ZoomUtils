import Vue from 'vue';
import App from './App';
import Vuetify from "vuetify";

   Vue.use(Vuetify);
global.browser = require('webextension-polyfill');

/* eslint-disable no-new */
new Vue({
  el: '#app',
    vuetify: new Vuetify(),
  render: h => h(App),
});
