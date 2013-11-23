function initialize() {
    var mapOptions = {
        zoom: 16,
        disableDoubleClickZoom: true,
        center: new google.maps.LatLng(38.03561521701325, -78.50336015224457)
    };
    
    var map = new google.maps.Map(document.getElementById('map-canvas'),
				  mapOptions);
    
    google.maps.event.addListener(map, 'dblclick', function(m) {
        placeMarker(m.latLng, map, true)
    });
    
    $.ajax({
        type: 'GET',
        url: '/get/',
        async: false,
        success: function(result){
            var events = $.parseJSON(result);
            $.each(events, function(i, event_obj) {
		var name = event_obj['name'];
		var longitude = event_obj['longitude'];
		var latitude = event_obj['latitude'];
		var location = new google.maps.LatLng(Number(latitude), Number(longitude));
		placeMarker(location, map);
            })
		}
    });
}

function placeMarker(location, map, info_window) {
    var info_window = info_window || false;
    var marker = new google.maps.Marker({
        position: location,
        map: map
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