L.mapbox.accessToken = 'pk.eyJ1IjoidGxqZXNzZSIsImEiOiJjaWpzd3RjbmkwaGI3dWZtNTFhMnF3NG9nIn0.wyaZAca7yx1zsAU0UPcMwg';
var info = document.getElementById('info');
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40.0012363,-83.0099576], 15);

var geocoder = L.mapbox.geocoder('mapbox.places');
var myLayer = L.mapbox.featureLayer().addTo(map);
var locData;
var noCoord = true;

var geoJson = [
    {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-83.011445, 40.004020]
        },
        properties: {
            title: 'John Stamos',
            height: '5\'10\"',
            weight: '165 lbs',
            phone: '555-7635',
            location: '112 W Woodruff Ave<br>Columbus, OH 43210',
            building: 'YES',
            floor: '2',
            inout: '72 degrees, indoors*',
      time: '19:37:54 3/6/2016',
            description: '*This is demo data and does<br> not represent the users location or information ',
            'marker-color': '#b20000'
        }
    }
];

myLayer.setGeoJSON(geoJson);

if (typeof(udata) != 'undefined'){
  updateGeoJSON();


}

// Listen for individual marker clicks.
myLayer.on('click',function(e) {
    // Force the popup closed.
    e.layer.closePopup();

    var feature = e.layer.feature;
    var content = '<div><table class="table table-hover"><h2 class="page-header name">' + feature.properties.title + '</h2>' +
    			  '<tr><img class="img-responsive" src="/img/head.jpg"></tr>' +
				  '<p><tr>' + 
                  '<td><strong>Height: <strong></td><td>' + feature.properties.height + '</td>' + 
                  '</tr><tr>' + 
                  '<td><strong>Weight: </strong></td><td>' + feature.properties.weight + '</td>' +
                  '</tr><tr>' +
                  '<td><strong>Phone Number: </strong></td><td>' + feature.properties.phone + '</td>' +
                  '</tr><tr>' +
                  '<td><strong>Reported Location: </strong></td><td>' + feature.properties.location + '</td>' +
                  '</tr><tr>' + 
                  '<td><strong>In a Building: </strong></td><td>' + feature.properties.building + '</td>' +
                  '</tr><tr>' +
                  '<td><strong>Building Floor: </strong></td><td>' + feature.properties.floor + '</td>' +
                  '</tr><tr>' +
                  '<td><strong>Device Temp: </strong></td><td>' + feature.properties.inout + '</td>' +
                  '</tr><tr>' +
				  '<td><strong>Last Reported: </strong></td><td>' + feature.properties.time + '</td>' +
				  '</tr></p></table>' +
                  '<br><p>' + feature.properties.description + '</p></div>';

    info.innerHTML = content;
});

// Clear the tooltip when map is clicked.
map.on('move', empty);

// Trigger empty contents when the script
// has loaded on the page.
empty();

window.setInterval(function() {
    if(typeof(udata) != 'undefined'){
      updateGeoJSON();
    } 
  }, 2000);

function empty() {
  info.innerHTML = '<div><strong>Click a marker</strong></div>';
}

function testLocation(err, data){
  console.log(data);
  locData = data.features[0].place_name;
  console.log(locData);
}

function getJSON(url, index, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response, index);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

function updateGeoJSON() {
  getJSON('/demoUpdate', null, function(err, data){
    udata = data;
  });

  if(typeof(admin) != 'undefined'){
    var dot = 0;
    for (var i = 0; i < udata.length; i++){
      if (typeof(udata[i].lat) != 'undefined' && typeof(udata[i].long) != 'undefined'){
        var promise = new Promise(function(resolve, reject) {
          var latitude;
          var longitude;
          if(udata[i].long == 'X' && udata[i].wlong != ''){
            latitude = udata[i].wlat;
            longitude = udata[i].wlong;
          } else {
            latitude = udata[i].lat;
            longitude = udata[i].long;
          }
          var geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + '%2C%20' + latitude + '.json?types=address&access_token=' + 'pk.eyJ1IjoidGxqZXNzZSIsImEiOiJjaWpzd3RjbmkwaGI3dWZtNTFhMnF3NG9nIn0.wyaZAca7yx1zsAU0UPcMwg';
          getJSON(geocodeURL, i, function(err, data, index){
            resolve(index + ',' + data.features[0].place_name);
          });
        });

        promise.then(function(response) {
          var address = response.split(',');
          var i = address[0];
          var latitude;
          var longitude;
          if(udata[i].long == 'X' && udata[i].wlong != ''){
            latitude = udata[i].wlat;
            longitude = udata[i].wlong;
          } else {
            latitude = udata[i].lat;
            longitude = udata[i].long;
          }
          geoJson[dot] = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude] //e.latlng.lng, e.latlng.lat]
              },
              properties: {
                title: udata[i].name,
                height: udata[i].height,
                weight: udata[i].weight,
                phone: udata[i].phone,
                location: address[1] + '<br>' + address[2] + ', ' + address[3],
                building: 'Coming soon',
                floor: 'Coming soon',
                inout: 'Coming soon',
                time: udata[i].time,
                description: 'Many features have not been implemented<br> much more to come.',
                'marker-color': '#b20000'
              }
          };
          dot++;
          noCoord = false;
          myLayer.setGeoJSON(geoJson);
          map.fitBounds(myLayer.getBounds());
        }, function(error){
          console.error("Failed!");
        });
        
        
      } // end if check for latlng //
    }
  } else if (typeof(udata.lat) != 'undefined'){

    var promise = new Promise(function(resolve, reject) {
      /*geocoder.reverseQuery([parseFloat(udata.long), parseFloat(udata.lat)], function(err, res){
        resolve(res.features[0].place_name);
      });*/
      var latitude;
      var longitude;
      if(udata.long == 'X' && udata.wlong != ''){
        latitude = udata.wlat;
        longitude = udata.wlong;
      } else {
        latitude = udata.lat;
        longitude = udata.long;
      }
      var geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + '%2C%20' + latitude + '.json?types=address&access_token=' + 'pk.eyJ1IjoidGxqZXNzZSIsImEiOiJjaWpzd3RjbmkwaGI3dWZtNTFhMnF3NG9nIn0.wyaZAca7yx1zsAU0UPcMwg';
      getJSON(geocodeURL, null, function(err, data){
        resolve(data.features[0].place_name);
      });
    });

    promise.then(function(response){
      var address = response.split(',');
      var latitude;
      var longitude;
      if(udata.long == 'X' && udata.wlong != 0){
        latitude = udata.wlat;
        longitude = udata.wlong;
      } else {
        latitude = udata.lat;
        longitude = udata.long;
      }
      geoJson = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] //e.latlng.lng, e.latlng.lat]
          },
          properties: {
            title: udata.name,
            height: udata.height,
            weight: udata.weight,
            phone: udata.phone,
            location: address[0] + '<br>' + address[1] + ', ' + address[2],
            building: 'Coming soon',
            floor: 'Coming soon',
            inout: 'Coming soon',
            time: udata.time,
            description: 'Many features have not been implemented<br> much more to come.',
            'marker-color': '#b20000'
          }
        }
      ];
      noCoord = false;
      map.setView([latitude, longitude], 15);
      myLayer.setGeoJSON(geoJson);
    }, function(error){
      console.error("Failed!");
    });
  }
}

