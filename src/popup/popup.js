import Vue from 'vue';
import Popup from './PopupBase';
import store from '../store';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '../fonts/Roboto/font_roboto.css';
Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#4dacfe',
        secondary: '#002f57',
        accent: '#38f527',
        error: '#b71c1c',
      },
      dark: {
        primary: '#002f57',
        secondary: '#4dacfe',
        accent: '#38f527',
        error: '#b71c1c',
      },
    },
  },
});

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  vuetify: vuetify,
  render: h => h(Popup),
});
