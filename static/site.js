var markers = new Array();

function initialize() {
  var mapOptions = {
    zoom: 16,
    disableDoubleClickZoom: true,
    center: new google.maps.LatLng(38.03561521701325, -78.50336015224457)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);

                                //Creating a new marker on double-click
                                google.maps.event.addListener(map, 'dblclick', function(m) {
                                  placeMarker(m.latLng, map, false, true)
                                });

                                //Populate with data from the server
                                $.ajax({
                                  type: 'GET',
                                  url: '/get/',
                                  async: false,
                                  success: function(result){
                                    var events = $.parseJSON(result);
                                    $.each(events, function(i, event_obj) {
                                      var data = event_obj
                                      var longitude = event_obj['longitude'];
                                      var latitude = event_obj['latitude'];
                                      var location = new google.maps.LatLng(Number(latitude), Number(longitude));
                                      placeMarker(location, map, data);
                                    })
                                  }
                                });
}

function login() {
  var url = "/login/&password" + $("")
  //Populate with data from the server
  $.ajax({
    type: 'POST',
    url: url,
    async: false,
    success: function(result){
      var events = $.parseJSON(result);
      $.each(events, function(i, event_obj) {
        console.log(i);
      });
    }});
    $("container").css("opacity", 1);
}
function open_login() {
  $("login").remove();
  var login = "<form class='login' action=/login/ method=post>\
  <h3 class='form-signin-heading'>Login to post events!</h3>\
  <input id=org type='text' class='form-control' placeholder='organization' required='' autofocus=''>\
  <input id=pass type='password' class='form-control' placeholder='Password' required=''>\
  <button class='btn btn-lg btn-primary btn-block' action=submit>Sign in</button>\
  </div>";
  $("body").append(login);
  $("container").css("opacity", "0.5");
}

function placeMarker(location, map, data, info_window) {
  var info_window = info_window || false;
  var data = data || false
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    name: (data['name'] || false)
  });
  if ( info_window ) {
    var html = "<div id='infoWindow'><label for='eventName'>Name:</label> <input type='text' id='eventName' /><br />" +
      "<input type='hidden' id='eventLat' value='" + location.lat() + "' /><input type='hidden' id='eventLon' value='" + location.lng() + "' />" +
      "<input type='button' id='eventSubmit' value='Save' onclick='submitEvent()' /></div>";
    var event_form_info_window = new google.maps.InfoWindow(
      {
      content: html
    });
    event_form_info_window.open(map, marker);
  } else {
    google.maps.event.addListener(marker, 'click', function(m) {
      var info_pane = "<div id='infoWindow'><span>" + data['name'] + "</span></div>";
      var event_form_info_window = new google.maps.InfoWindow(
        {
        content: info_pane
      });
      event_form_info_window.open(map, marker);
    });
  }
}

function submitEvent() {
  var name = $("#eventName").val();
  var latitude = $("#eventLat").val();
  var longitude = $("#eventLon").val();
  var event_obj = {name: name, latitude: latitude, longitude: longitude};

  var result = $.ajax({
    type: 'POST',
    data: event_obj,
    dataType: 'text',
    url: '/add/',
    success: function() {
      $("#infoWindow").html("<p>Success!</p>");
    }

  });
  result.error(function() { alert("Something went wrong"); });
}

google.maps.event.addDomListener(window, 'load', initialize);
