import store from './store';
global.browser = require('webextension-polyfill');

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Hello from the background');

  browser.tabs.executeScript({
    file: 'content-script.js',
  });
});
