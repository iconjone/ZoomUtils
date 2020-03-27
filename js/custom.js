  var deleteMode = false;
  var addMode = false;
  var infoMode = false;
window.addEventListener('load', (event) => {
  $('#introNotification').addClass('d-none')
showTable()
$( function() {
    $( "#appendZoomData" ).sortable({
      revert: true,
      stop: function( event, ui ) {updateTableToJSON();}
    });
    $( "tbody, tr" ).disableSelection();
  } );

  $( "#addZoomBtn" ).click(function() {
    addZOOM();
  });
  $( "#delZoomBtn" ).click(function() {
    delZOOM();
  });
  $( "#addOption" ).click(function() {
    addMode = !addMode
  //  $('#addIcon').toggleClass('d-none')
    $('#addIcon').toggleClass('wiggle')
    $("#addInputGroup").toggleClass("d-none");
if(!deleteMode && !addMode && !infoMode)
    location.reload()
  });
  $( "#addIcon" ).click(function() {
        addMode = !addMode
    //$('#addIcon').toggleClass('d-none')
    $('#addIcon').toggleClass('wiggle')
    $("#addInputGroup").toggleClass("d-none");
if(!deleteMode && !addMode && !infoMode)
    location.reload()
  });

  $('.navbar-nav>li>a').on('click', function(){
      $('.navbar-collapse').collapse('hide');
  });
  $('#reset').on('click', function(){
    chrome.storage.sync.set({zoomData: '[{"class":"ESET 210","meetingID":"123456789","info":"This is an example"}, {"class":"CSCE 222","meetingID":"123456789","info":"HELL MW 2:30 PM"}, {"class":"PHYS 207","meetingID":"123456789","info":"TA SESSION 3:00 PM"}]'}, function() {
      console.log("Installation Set.");
      showTable();
    });
  });

$( "#delOption" ).click(function() {
  deleteMode = !deleteMode
  if(deleteMode){
    makeDelListener()
  }
//  $('#delIcon').toggleClass('d-none')
  $('#delIcon').toggleClass('wiggle')
  $("#delInputGroup").toggleClass("d-none");
if(!deleteMode && !addMode && !infoMode)
  location.reload()
});
$( "#delIcon" ).click(function() {
    deleteMode = !deleteMode
    if(deleteMode){
      makeDelListener()
    }
//  $('#delIcon').toggleClass('d-none')
  $('#delIcon').toggleClass('wiggle')
  $("#delInputGroup").toggleClass("d-none");
if(!deleteMode && !addMode && !infoMode)
  location.reload()
});



$(' #introInfo' ).click(function() {
  infoMode = !infoMode;
$("#introNotification").toggleClass("d-none");
$(' #introInfo' ).toggleClass('wiggle')
if(!deleteMode && !addMode && !infoMode)
location.reload()
});
//$('html').height($('body').height());
});


function showTable(){
chrome.storage.sync.get('zoomData', function(data) {
    //console.log(data);
    tableBody = document.getElementById("appendZoomData");
    tableBody.innerHTML = "";
    dataIterator = Object.entries(JSON.parse(data.zoomData))
    dataIterator.forEach((zoom) =>{
        zoom = zoom[1];
        tr = document.createElement('tr');
        classElement = document.createElement('td')
        classElement.innerText = zoom.class;
        meetingID = document.createElement('td')
        meetingID.setAttribute('meetingID', zoom.meetingID)
        meetingIDSpace = zoom.meetingID.substring(0,3) + " " + zoom.meetingID.substring(3,6) + " " + zoom.meetingID.substring(6);
        link = document.createElement('a');
        link.setAttribute('target', 'blank');
        link.setAttribute('href', 'zoommtg://tamu.zoom.us/join?action=join&confno=' + zoom.meetingID)
        link.innerText = meetingIDSpace;
        meetingID.append(link)
      //  meetingID.innerText = zoom.meetingID;
        info = document.createElement('td')
        info.innerText = zoom.info;
        tr.append(classElement);
        tr.append(meetingID);
        tr.append(info)
        tableBody.append(tr);


    })

  });
}

function updateTableToJSON(){
  set = [];
  tableBody = document.getElementById("appendZoomData");
  entries = Object.entries(tableBody.children)
  entries.forEach(entry =>{
    entry = entry[1];
    object = {};
    object.class = entry.children[0].innerText;
    object.meetingID = entry.children[1].getAttribute('meetingID')+"";
    object.info = entry.children[2].innerText;
    set.push(object)

  })


  chrome.storage.sync.set({zoomData: JSON.stringify(set)}, function() {
    console.log("New Data Set.");
  });


}


function addZOOM(){
  updateTableToJSON();
  classAdd = document.getElementById('classAdd').value;
  document.getElementById('classAdd').value = '';
  meetID = document.getElementById('meetID').value;
  meetID = meetID.replace(/\s/g, '');
  document.getElementById('meetID').value = "";
  info = document.getElementById('info').value;
  document.getElementById('info').value = "";

  object = {};
  object.class = classAdd;
  object.meetingID = meetID;
  object.info = info;
chrome.storage.sync.get('zoomData', function(data) {
  data = JSON.parse(data.zoomData);
  data.push(object)

  chrome.storage.sync.set({zoomData: JSON.stringify(data)}, function() {
    console.log("New Data Set.");
    showTable()
  });
});

}

function delZOOM(){
updateTableToJSON();
meetingIDDel = document.getElementById('meetingIDDel').value;
document.getElementById('meetingIDDel').value = '';
meetingIDDel = meetingIDDel.replace(/\s/g, '');
chrome.storage.sync.get('zoomData', function(data) {
  changed = true;
  data = JSON.parse(data.zoomData);

   data = data.filter(({meetingID}) => !meetingID.includes(meetingIDDel))

    chrome.storage.sync.set({zoomData: JSON.stringify(data)}, function() {
      console.log("New Data Set.");
      showTable()
    });


});


}
function makeDelListener(){
  console.log('ran')
  console.log($('tbody tr'))
$('tbody').on('click', 'tr', function( event ) {
  console.log("running")
  meetingIDDel = event.target.parentElement.children[1].getAttribute('meetingID');
  console.log(meetingIDDel)
  chrome.storage.sync.get('zoomData', function(data) {
    changed = true;
    data = JSON.parse(data.zoomData);

     data = data.filter(({meetingID}) => !meetingID.includes(meetingIDDel))

      chrome.storage.sync.set({zoomData: JSON.stringify(data)}, function() {
        console.log("New Data Set.");
        showTable()
      });


  });
});
}
