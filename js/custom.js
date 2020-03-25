window.addEventListener('load', (event) => {
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
    $("#addInputGroup").toggleClass("d-none");
  });
  $('.navbar-nav>li>a').on('click', function(){
      $('.navbar-collapse').collapse('hide');
  });

  $(' #delOption' ).click(function() {
    console.log("clicked delete")
  $("#delInputGroup").toggleClass("d-none");
});

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
        meetingIDSpace = zoom.meetingID.substring(0,3) + " " + zoom.meetingID.substring(3,6) + " " + zoom.meetingID.substring(6,9);
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