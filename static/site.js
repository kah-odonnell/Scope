var markers = new Array();
var markerPoints = new Array();
var map;

function initialize() {
    var mapOptions = {
        zoom: 16,
        disableDoubleClickZoom: true,
        center: new google.maps.LatLng(38.03561521701325, -78.50336015224457)
    };
    
    map = new google.maps.Map(document.getElementById('map-canvas'),
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
    markerPoints.push(marker);

    google.maps.event.addListener(marker, 'click', function(m) {
        $.each(markers, function(i, pane){
            pane.close();
        });
        var info_pane = 
        "<div style='width: 200px; height: 100px;' id='infoWindow'><span>" + data['name'] + "</span><br><span>" + data['organization'] + "</span><br><span>" + data['date'] + "</span><br><span>" + data['time'] + "</span><br></div>" ;
        var event_form_info_window = new google.maps.InfoWindow(
        {
                    content: info_pane
        });
        event_form_info_window.open(map, marker);
        markers.push(event_form_info_window);
    });
}

function setAllMap(m) {
    for (var i = 0; i < markerPoints.length; i++) {
    markerPoints[i].setMap(m);
    }
}
function clearMarkers() {
    setAllMap(null);
    markerPoints = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() { 
    // bind 'myForm' and provide a simple callback function 
    $('#notify_button').click(function() { 
        $('#login').css('display','none');
        $('#register').css('display','none');
        $('#signup').css('display','inline');
    }); 
    $('#login_button').click(function() { 
        $('#login').css('display','inline');
        $('#register').css('display','none');
        $('#signup').css('display','none');
    }); 
    $('#register_button').click(function() { 
        $('#login').css('display','none');
        $('#register').css('display','inline');
        $('#signup').css('display','none');
    }); 
    $('#myForm').ajaxForm(function() { 
        $('#signup').css('display','none');
    }); 
    $("#slider").dateRangeSlider({
    defaultValues: {
        min: new Date(2013, 0, 1),
        max: new Date(2013, 11, 31)
    },
    bounds: {
        min: new Date(2013, 0, 1),
        max: new Date(2013, 11, 31)
    }});
    $("#slider").bind("valuesChanged", function(e, data) {
    var start = String(data.values.min);
    var end = String(data.values.max);
    start = start.replace(/\(.*\)/g, "");
    end = end.replace(/\(.*\)/g, "");
    var getdata = "start=" + start +"&end=" + end;
    $.ajax({
            type: 'GET',
        data: getdata,
            url: '/get/',
            async: false,
            success: function(result){
        clearMarkers();
        var events = $.parseJSON(result);
        $.each(events, function(i, event_obj) {
                var data = event_obj
                var longitude = event_obj['longitude'];
                var latitude = event_obj['latitude'];
                var location = new google.maps.LatLng(Number(latitude), Number(longitude));
                placeMarker(location, map, data);
        })
            }});
    
    console.log("Values changed. min: " + data.values.min + ", max: " + data.values.max);
    });
}); 