import * as types from './mutation-types';

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  [types.UPDATE_ZOOM_DATA](state, payload) {
    state.zoomData = payload;
  },
  [types.UPDATE_DARK_MODE](state, payload) {
    state.darkmode = payload;
  },
  [types.UPDATE_SCHEDULE_DATA](state, payload) {
    state.scheduleData = payload;
  },
  [types.UPDATE_REMINDER](state, payload) {
    state.reminder = payload;
  },
  [types.UPDATE_AUTO_JOIN](state, payload) {
    state.autoJoin = payload;
  },
};
