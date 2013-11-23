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

function placeMarker(location, map, data, info_window) {
    var info_window = info_window || false;
    var data = data || false
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        name: (data['name'] || false),
        org: (data['organization'] || false)
    });
    google.maps.event.addListener(marker, 'click', function(m) {
        $.each(markers, function(i, pane){
            pane.close();
        });
        var info_pane = 
        "<div style='width: 200px; height: 200px;' id='infoWindow'><span>" + data['name'] + "</span><br><span>" + data['organization'] + "</span><br></div>";
        var event_form_info_window = new google.maps.InfoWindow(
		{
                    content: info_pane
		});
        event_form_info_window.open(map, marker);
        markers.push(event_form_info_window)
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
