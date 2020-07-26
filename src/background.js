// import store from './store';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';

import * as actions from './store/actions';
import * as getters from './store/getters';
import mutations from './store/mutations';

global.browser = require('webextension-polyfill');

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    VuexWebExtensions({
      //  persistentStates: ['currentTabUrl'],
    }),
  ],
  state: {
    //  currentTabUrl: '',
  },
  getters,
  mutations,
  actions,
});

// browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log('Hello from the background');
//
//   browser.tabs.executeScript({
//     file: 'content-scripts\\content-script.js',
//   });
// });
console.log('Background Data Loaded..');

browser.runtime.onInstalled.addListener(function(details) {
  console.log('got here');
  if (details.reason === 'install') {
    browser.storage.sync
      .set({
        zoomData: [
          { class: 'ESET 210', meetingID: '12345678', info: 'Click on the info Icon!', key: 1 },
          { class: 'CSCE 222', meetingID: '123456789', info: 'HELL MW 10:20 AM', key: 2 },
          { class: 'PHYS 207', meetingID: '12345679', info: 'TA SESSION 3:00 PM', key: 3 },
        ],
      })
      .then(promise => {
        console.log(promise, 'Installation set');
      });
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      browser.storage.sync.set({ darkmode: 'true' }).then(promise => {
        console.log(promise, 'Darkmode Set');
      });
      console.log('dark Mode');
    } else {
      browser.storage.sync.set({ darkmode: 'false' }).then(promise => {
        console.log(promise, 'Darkmode Set');
      });
      console.log('light Mode');
    }
    initStore();
  } else if (details.reason === 'update') {
    console.log('Updating....');
    browser.storage.sync.get('zoomData').then(data => {
      if (typeof data.zoomData === 'string' || data.zoomData instanceof String) {
        // Process old data and add any needed information.
        var zoomData = JSON.parse(data.zoomData);
        zoomData.forEach((item, i) => {
          zoomData[i].key = item.meetingID + item.class + item.info; // make the key id+name+info
        });
        var promise = browser.storage.sync.set({ zoomData: zoomData });
        console.log(promise);
        console.log('Old string data has been converted to object data');
      }
      initStore();
    });
  }
  // else{
  //   initStore()
  // }
  console.log(details);
  // browser.storage.sync.get('zoomData').then(data => {
  //   console.log('commiting data', data.zoomData);
  //   store.dispatch('setZoomData', data.zoomData);
  //   console.log(store);
  // });
});
initStore();
// needs to run after above function
function initStore() {
  browser.storage.sync.get().then(data => {
    console.log(data);
    store.dispatch('initZoomData', data.zoomData);
    store.dispatch('initDarkMode', data.darkmode);
  });
}

browser.tabs.onActivated.addListener(listener => {
  browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
    results[0].forEach((item, i) => {
      if (item.includes('zoom')) {
        // do some magic to determine if is zoom link
        if (item.search('/[a-z]/\\d\\d\\d\\d\\d\\d\\d\\d\\d+') != -1) {
          browser.browserAction.setBadgeText({ text: 'ADD', tabId: listener.tabId });
        }
      }
    });

    // return results[0];
  });
});

// https://stackoverflow.com/questions/56815002/store-data-from-background-js-into-the-vuex-store
/// / TODO: We need to figure out how to use this npm package to pass data from stores.

// replicate old users data
// chrome.storage.sync.set(
//   {
//     zoomData:
//       '[{"class":"ESET 210","meetingID":"123456789","info":"Default Settings. Click Info!"}, {"class":"CSCE 222","meetingID":"123456789","info":"HELL MW 2:30 PM"}, {"class":"PHYS 207","meetingID":"123456789","info":"TA SESSION 3:00 PM"}]',
//   },
//   function() {
//     console.log('Installation Set.');
//   }
// );
