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

var markers = new Array();

function getDatePickers() {
    $('#map-canvas').find('input.datepicker').each(function(index, element) {
        //$(element).removeClass('hasDatepicker');
        $(element).datepicker();
    });
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
        $.each(markers, function(i, pane){
            pane.close();
        });
        var html = "<div id='infoWindow'><label for='eventName'>Name:</label> <input type='text' id='eventName' /><br />" +
            "<input type='hidden' id='eventLat' value='" + location.lat() + "' /><input type='hidden' id='eventLon' value='" + location.lng() + "' />" +
            "<label for='eventDate'>Date:</label>   <input type='text' id='eventDate' class='datepicker' /><br><label for='eventTime'>Time:</label>   <input type='text' id='eventTime' /><br><input type='button' id='eventSubmit' value='Save' onclick='submitEvent()' /></div>";
        var event_form_info_window = new google.maps.InfoWindow({
		    content: html
        });
        event_form_info_window.open(map, marker);
        google.maps.event.addListener(event_form_info_window, 'domready', function() {
            $('.datepicker').datepicker();                   
        });
    }
    google.maps.event.addListener(marker, 'click', function(m) {
        $.each(markers, function(i, pane){
            pane.close();
        });
        var info_pane = 
        "<div style='width: 200px; height: 200px;' id='infoWindow'><span>" + data['name'] + "</span><br><span>" + data['organization'] + "</span><br><span>" + data['date'] + "</span><br><span>" + data['time'] + "</span><br></div>" ;
        var event_form_info_window = new google.maps.InfoWindow(
        {
                    content: info_pane
        }); 
        event_form_info_window.open(map, marker);
        markers.push(event_form_info_window)
    });
    
}

function submitEvent() {
    var name = $("#eventName").val();
    var latitude = $("#eventLat").val();
    var longitude = $("#eventLon").val();
    var date = $("#eventDate").val();
    var time = $("#eventTime").val();
    var event_obj = {name: name, latitude: latitude, longitude: longitude, date: date, time: time};
    
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
}); 