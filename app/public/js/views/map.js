L.mapbox.accessToken = 'pk.eyJ1IjoidGxqZXNzZSIsImEiOiJjaWpzd3RjbmkwaGI3dWZtNTFhMnF3NG9nIn0.wyaZAca7yx1zsAU0UPcMwg';
var info = document.getElementById('info');
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40.0012363,-83.0099576], 15);

//var geocoder = L.mapbox.geocoder('mapbox.places');
var myLayer = L.mapbox.featureLayer().addTo(map);
var geoJson = [];
var noCoord = true;

if (typeof(udata) != 'undefined'){
  /*if(navigator.geolocation) {
    map.locate();

    map.on('locationfound', function(e) {
      map.fitBounds(e.bounds);*/
    //geocoder.reverseQuery([udata.long, udata.lat], testLocation);
  if(admin == 'Yes'){
    var dot = 0;
    for (var i = 0; i < udata.length; i ++){
      if (typeof(udata[i].lat) != 'undefined'){
        geoJson[dot] = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [udata[i].long, udata[i].lat] //e.latlng.lng, e.latlng.lat]
            },
            properties: {
              title: udata[i].name,
              height: udata[i].height,
              weight: udata[i].weight,
              phone: udata[i].phone,
              location: 'Location from browser<br>Geocoding coming soon',
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
        map.setView([udata[i].lat, udata[i].long], 15);
      } // end if check for latlng //
    }
  } else if (typeof(udata.lat) != 'undefined'){
    geoJson = [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [udata.long, udata.lat] //e.latlng.lng, e.latlng.lat]
        },
        properties: {
          title: udata.name,
          height: udata.height,
          weight: udata.weight,
          phone: udata.phone,
          location: 'Location from browser<br>Geocoding coming soon',
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
    map.setView([udata.lat, udata.long], 15);
  }

  

  myLayer.setGeoJSON(geoJson);
    /*});

    map.on('locationerror', function() {
      console.log("Could not find location");
    });
  }*/


}

if (noCoord) {
  geoJson = [
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
              description: 'Location, floor, and temperature are based on<br> last reported result and may not be accurate.',
              'marker-color': '#b20000'
          }
      }
  ];
}

myLayer.setGeoJSON(geoJson);

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

function empty() {
  info.innerHTML = '<div><strong>Click a marker</strong></div>';
}

function testLocation(err, data){
  console.log(data);
}

