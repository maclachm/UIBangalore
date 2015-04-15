$('.uk-form').submit(function(event) {
// Stop the browser from submitting the form.
event.preventDefault();

val = $('form input').val()

request(val)

});

function request(text) {
  $.ajax(
    {
      type: 'GET',
      url: '/data',
      dataType: 'json',
      data: {name: text},
      contentType: 'application/json; charset=utf-8',
      success: function (result) {
        parseResponse(result)
      },
      error: function (req, status, error) {
        alert('Unable to get data');
      }
    });
}

function parseResponse(data) {

//console.log(data)

layer1 = new L.GeoJSON();
layer1.on('data', function(e) {
  e.layer.setStyle({ color:  '#DD8B12', weight: 2, fill: true, fillColor: '#DD8B12' });
});
layer1.addData(data);
map.addLayer(layer1);
map.fitBounds(layer1.getBounds(), animate=true);
}