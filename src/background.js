// import store from './store';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';
import moment from 'moment';

import * as actions from './store/actions';
import * as getters from './store/getters';
import mutations from './store/mutations';
import Timer from 'tiny-timer';

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
          { class: 'ESET 210', meetingID: '123456789', info: 'Click on the info Icon!', key: 1, notification: false },
          { class: 'CSCE 222', meetingID: '123456789', info: 'Meet with Professor', key: 2, notification: false },
          { class: 'PHYS 207', meetingID: '123456789', info: 'Homework due', key: 3, notification: false },
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
    browser.storage.sync.set({ reminder: ['15'], autoJoin: false }).then(data => {
      console.log('set reminder and auto join');
    });

    initStore();
  } else if (details.reason === 'update') {
    console.log('Updating....');
    browser.storage.sync.get().then(data => {
      if (typeof data.zoomData === 'string' || data.zoomData instanceof String) {
        // Process old data and add any needed information.
        var zoomData = JSON.parse(data.zoomData);
        zoomData.forEach((item, i) => {
          zoomData[i].key = item.meetingID + item.class + item.info; // make the key id+name+info
          zoomData[i].notification = false;
        });
        var promise = browser.storage.sync.set({ zoomData: zoomData });
        console.log(promise);
        console.log('Old string data has been converted to object data');
      }
      if (data.reminder == undefined)
        browser.storage.sync.set({ reminder: ['15'] }).then(data => {
          console.log('set reminder and auto join');
        });
      if (data.autoJoin == undefined)
        browser.storage.sync.set({ autoJoin: false }).then(data => {
          console.log('set reminder and auto join');
        });
      initStore();
    });
  }

  console.log(details);
});
initStore();
// needs to run after above function
function initStore() {
  browser.storage.sync.get().then(data => {
    console.log(data);
    store.dispatch('initZoomData', data.zoomData);
    store.dispatch('initDarkMode', data.darkmode);
    store.dispatch('initReminder', data.reminder);
    store.dispatch('initAutoJoin', data.autoJoin);
    createNotificationHandler();
  });
}
// store.dispatch('setAutoJoin', true);
browser.tabs.onActivated.addListener(listener => {
  browser.tabs
    .executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' })
    .then(results => {
      results[0].forEach((item, i) => {
        if (item.includes('zoom.us/j/') || item.includes('zoom.us/w/') || item.includes('zoom.us/wc/')) {
          // .us suffix + valid filler should guarantee it's a zoomie
          // do some magic to determine if is zoom link
          if (item.search('[0-9]{9,}') != -1) {
            // passing the extraction test means there is an ID to be extracted
            browser.browserAction.setBadgeText({ text: 'ADD', tabId: listener.tabId });
          }
        }
      });

      // return results[0];
    })
    .catch(e => {
      console.log(e);
    });
});

function createNotificationHandler() {
  browser.alarms.clearAll();
  var zoomData = store.state.zoomData;
  zoomData.forEach((zoom, z) => {
    if (zoom.scheduleData != undefined)
      zoom.scheduleData.forEach((schedule, s) => {
        schedule.days.forEach((day, d) => {
          if (zoom.notification && day) {
            if (store.state.reminder != [] && store.state.reminder != undefined);
            store.state.reminder.forEach((item, i) => {
              browser.alarms.create(
                JSON.stringify({ data: zoom, timeDelay: item }), // optional string with more data
                { when: findClosestFutureTime(d, schedule.time, item), periodInMinutes: 10080 } // optional object
              );
            });
            browser.alarms.create(
              JSON.stringify({ data: zoom, timeDelay: 0 }), // optional string with more data
              { when: findClosestFutureTime(d, schedule.time, 0), periodInMinutes: 10080 } // optional object
            );
          }
        });
      });
  });
}

function findClosestFutureTime(dayIndex, time, delay) {
  var hour = time.split(':')[0];
  //  if (hour == '00') hour = 12;

  var date = moment()
    .day(dayIndex)
    .hour(hour)
    .minute(time.split(':')[1])
    .second(0)
    .subtract(delay, 'minutes');

  if (date < moment()) date.add(7, 'days');
  return date.valueOf();
}

// console.log("creating alarm")
// console.log(browser)
// browser.alarms.create(
//   "test",              // optional string
//   {when: Date.now(), periodInMinutes:1}          // optional object
// )
//
browser.alarms.onAlarm.addListener(alarm => {
  // clear All active current notifications so user doesn't have too many
  browser.notifications.getAll().then(notifications => {
    notifications = Object.keys(notifications);
    if (notifications.length > 0) {
      notifications.forEach(notification => {
        browser.notifications.clear(notification);
      });
    }
  });

  if (moment(alarm.scheduledTime) > moment().subtract(5, 'minutes')) {
    var alarmData = JSON.parse(alarm.name);
    if (alarmData.timeDelay != 0) {
      browser.notifications
        .create('', {
          iconUrl: 'icons/icon_128.png',
          type: 'basic',
          title: alarmData.data.class + ' is starting soon.',
          message: alarmData.data.class + ' is starting in ' + alarmData.timeDelay + ' minutes. Click to launch now.',
        })
        .then(notification => {
          browser.notifications.onClicked.addListener(notification => {
            var zoomLink = generateZoomLink(alarmData.data);
            window.open(zoomLink, 'extension_popup');
          });
        });
    } else {
      if (store.state.autoJoin) {
        browser.notifications
          .create('', {
            iconUrl: 'icons/icon_128.png',
            type: 'basic',
            title: alarmData.data.class + ' is starting now.',
            message: alarmData.data.class + ' is starting now. Auto Joining in 15 seconds. Click to prevent launch.',
            requireInteraction: true,
          })
          .then(notification => {
            var preventLaunch = false;
            var timer = new Timer();
            timer.stop();
            timer.start(1000 * 15);
            // timer.on('tick', ms => {
            //   console.log(Math.round(100 - (timer.time / timer.duration) * 100), notification);
            //   var test = browser.notifications
            //     .update(
            //       notification, // string
            //       {
            //         message: alarmData.data.class + ' is starting now. Auto Joining in ' + Math.round(timer.time / 1000) + ' seconds. Click to prevent launch.',
            //         progress: Math.round(100 - (timer.time / timer.duration) * 100),
            //       } // NotificationOptions
            //     )
            //     .then(update => {
            //       if (!update) {
            //         preventLaunch = true;
            //         timer.stop();
            //       }
            //       console.log(update);
            //     });
            //   console.log(test);
            // });

            browser.notifications.onClicked.addListener(notification => {
              preventLaunch = true;
              timer.stop();
            });
            browser.notifications.onClosed.addListener(notification => {
              preventLaunch = true;
              timer.stop();
            });

            timer.on('done', () => {
              if (!preventLaunch) {
                var zoomLink = generateZoomLink(alarmData.data);
                window.open(zoomLink, 'extension_popup');
                browser.notifications.clear(notification);
              }
            });
          });
      } else {
        browser.notifications
          .create('', {
            iconUrl: 'icons/icon_128.png',
            type: 'basic',
            title: alarmData.data.class + ' is starting now.',
            message: alarmData.data.class + ' is starting now. Click to launch.',
          })
          .then(notification => {
            browser.notifications.onClicked.addListener(notification => {
              var zoomLink = generateZoomLink(alarmData.data);
              window.open(zoomLink, 'extension_popup');
            });
          });
      }
    }
  }
});

function generateZoomLink(zoomData) {
  /// / TODO: make this neater and smarter
  if (zoomData.password != '' && zoomData.password != undefined) {
    return 'zoommtg://jonathan.zoom.us/join?action=join&confno=' + zoomData.meetingID + '&pwd=' + zoomData.password;
  }
  return 'zoommtg://jonathan.zoom.us/join?action=join&confno=' + zoomData.meetingID;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.greeting == 'createNotificationHandler') {
    createNotificationHandler();
  }
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
