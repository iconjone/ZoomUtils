import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexWebExtensions({})],
  state: {
    foo: 'bar',
    zoomData: [],
  },
  getters,
  mutations,
  // actions,
});
