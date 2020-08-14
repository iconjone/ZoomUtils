import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';
import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';
global.browser = require('webextension-polyfill');

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexWebExtensions({})],
  state: {
    foo: 'bar',
    zoomData: [],
    darkmode: false,
    scheduleData: [],
    reminder: [],
    autoJoin: false,
    webclient: false,
  },
  getters,
  mutations,
  actions,
});
