import store from './store';
global.browser = require('webextension-polyfill');

// browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log('Hello from the background');
//
//   browser.tabs.executeScript({
//     file: 'content-scripts\\content-script.js',
//   });
// });
console.log('Background Data Loaded..');

browser.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    browser.storage.sync.set(
      {
        zoomData: [
          { class: 'ESET 210', meetingID: '123456789', info: 'Click on the info Icon!' },
          { class: 'CSCE 222', meetingID: '123456789', info: 'HELL MW 10:20 AM' },
          { class: 'PHYS 207', meetingID: '123456789', info: 'TA SESSION 3:00 PM' },
        ],
      },
      function() {
        console.log('Installation Set.');
      }
    );
  } else if (details.reason === 'update') {
    browser.storage.sync.get('zoomData').then(data => {
      if (typeof data.zoomData === 'string' || data.zoomData instanceof String) {
        browser.storage.sync.set({ zoomData: JSON.parse(data.zoomData) });

        console.log('Old string data has been converted to object data');
      }
    });
  }
  console.log(details);
  browser.storage.sync.get('zoomData').then(data => {
    console.log('commiting data', data.zoomData);
    store.commit('setZoomData', data.zoomData);
    console.log(store.state.zoomData);
  });
});
browser.storage.sync.get('zoomData').then(data => {
  console.log('commiting data', data.zoomData);
  store.commit('setZoomData', data.zoomData);
  console.log(store.state.zoomData);
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
