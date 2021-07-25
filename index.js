mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/austinrs16/ckhk49v3x0znh19o35r2mozoa', // style URL
  center: [-121.6, 48], // starting position as [lng, lat]
  zoom: 10, // starting zoom
});


map.on('load', function(){


map.addSource('WALL',{
       "type": "geojson",
       "data": "jsons/WALL.geojson"
   });
  map.addLayer({
     "id":"WALL",
     "type":"circle",
     "source":"WALL",
     "layout": {'visibility': 'visible'},
     "paint": {
      // 'line-color': '',
    },
   });
    });
    map.on('click', 'WALL', function (e) {
      console.log(e.features[0].properties['Facility'])

    document.getElementById('my_dataviz').style.display='block';




    });
