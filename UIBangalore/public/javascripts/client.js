var point = [12.9667, 77.5667]; //initialize to bangalore
userLocation = [0,0]; // user location

function getLatLong(text){
    //uses google api to get lat/long

    var coder = new google.maps.Geocoder();
    var address = {address: text};
    result = coder.geocode(address, function(data){


        locObj = (data[0].geometry.location); // gets only first match

        point = [locObj.lat(), locObj.lng()]; // set point to lat/long object of callback
        
    });
}

function userPosition(){
    //sets user position (unused)

    navigator.geolocation.getCurrentPosition(function(pos){

        userLocation = [pos.coords.latitude, pos.coords.longitude];

        });
}

$('#layerSearch').submit(function(event) {
// Stop from submitting the form.
event.preventDefault();

val = $('form input').val()
console.log(val)

request2(val)

});


function request(text) {
    $.ajax(
    {
    type: 'GET',
    url: '/data2',
    dataType: 'json',
    data: {name: text},
    contentType: 'application/json; charset=utf-8',
    success: function (result) {
    parseResponse(result)
    },
    error: function (req, status, error) {
    //alert('Unable to get data');
    }
    });
}

function parseResponse(data) {

    layer1 = new L.GeoJSON();
    layer1.on('data', function(e) {
    e.layer.setStyle({ color:  '#DD8B12', weight: 2, fill: true, fillColor: '#DD8B12' });
    });
    layer1.addData(data);
    map.addLayer(layer1);
    map.fitBounds(layer1.getBounds(), animate=true);

    popup.openOn(layer1);
}
