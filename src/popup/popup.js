import Vue from 'vue';
import Popup from './PopupBase';
import store from '../store';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';
import '../fonts/Roboto/font_roboto.css';
Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#002f57',
        secondary: '#adb5bd',
        accent: '#db6f02',
        error: '#b71c1c',
        success: '#27b81a',
      },
      dark: {
        primary: '#002f57',
        secondary: '#adb5bd',
        accent: '#db6f02',
        error: '#b71c1c',
        success: '#27b81a',
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
