import * as types from './mutation-types';
global.browser = require('webextension-polyfill');

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
export const setZoomData = ({ commit }, payload) => {
  console.log('Committing and syncing data');
  browser.storage.sync.set({ zoomData: payload });
  commit(types.UPDATE_ZOOM_DATA, payload);
};
export const initZoomData = ({ commit }, payload) => {
  console.log('Committing data');
  commit(types.UPDATE_ZOOM_DATA, payload);
};
