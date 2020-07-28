import * as types from './mutation-types';
global.browser = require('webextension-polyfill');

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
export const setZoomData = ({ commit }, payload) => {
  console.log('Committing and syncing data');
  commit(types.UPDATE_ZOOM_DATA, payload);
  browser.storage.sync.set({ zoomData: payload });
};
export const initZoomData = ({ commit }, payload) => {
  console.log('Committing data');
  commit(types.UPDATE_ZOOM_DATA, payload);
};
export const setDarkMode = ({ commit }, payload) => {
  console.log('Committing and syncing data');
  commit(types.UPDATE_DARK_MODE, payload);
  browser.storage.sync.set({ darkmode: payload });
};
export const initDarkMode = ({ commit }, payload) => {
  console.log('Committing darkModeData');
  commit(types.UPDATE_DARK_MODE, payload);
};
export const setScheduleData = ({ commit }, payload) => {
  commit(types.UPDATE_SCHEDULE_DATA, payload);
};
