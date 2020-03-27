'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason === 'install')
    chrome.storage.sync.set({zoomData: '[{"class":"ESET 210","meetingID":"123456789","info":"Click on the info Icon!"}, {"class":"CSCE 222","meetingID":"123456789","info":"HELL MW 10:20 AM"}, {"class":"PHYS 207","meetingID":"123456789","info":"TA SESSION 3:00 PM"}]' }, function() {
      console.log("Installation Set.");

    });
    console.log(details)
  });



  // chrome.storage.sync.set({zoomData: '[{"class":"ESET 210","meetingID":"756676286","info":"Ta Led class"}, {"class":"ESET 210","meetingID":"756676286","info":"Ta Led class"}]'}, function() {
  //   console.log("The color is working.");
  // });
