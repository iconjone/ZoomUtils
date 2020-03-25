'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({zoomData: '[{"class":"ESET 210","meetingID":"123456789","info":"This is an example"}, {"class":"CSCE 222","meetingID":"123456789","info":"HELL MW 2:30 PM"}, {"class":"PHYS 207","meetingID":"123456789","info":"TA SESSION 3:00 PM"}]'}, function() {
      console.log("Installation Set.");
    });
  });


  // chrome.storage.sync.set({zoomData: '[{"class":"ESET 210","meetingID":"756676286","info":"Ta Led class"}, {"class":"ESET 210","meetingID":"756676286","info":"Ta Led class"}]'}, function() {
  //   console.log("The color is working.");
  // });
