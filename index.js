////////////////////////////////////////////////////////////////////

////  Map
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

///////////////////////////////////////////////////////////////////

/////  Function to query graph for hatchery clicked
 map.on('click', 'WALL', function (e) {
   console.log(e.features[0].properties['Facility'])
//////////////////////////////////////////////////////////////////
////   Funcition for histograms
        //read data
        d3.csv("https://raw.githubusercontent.com/AustinRS016/D3/main/output/" + e.features[0].properties['Facility'] + ".csv", function(data) {
          // set the dimensions and margins of the graph
          var margin = {top: 60, right: 30, bottom: 20, left:110},
              width = 460 - margin.left - margin.right;

          // Get the different categories and count them
          var categories = data.columns
          var n = categories.length
          var  height = n * 27;

          // append the svg object to the body of the page
          var svg = d3.select("#my_dataviz")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

          // Add X axis
          var x = d3.scaleLinear()
            .domain([0, 366])
            .range([ 0, 366]);
          let xAxisGenerator = d3.axisBottom(x);
          let tickLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          xAxisGenerator.tickValues([0,31,59,90,120,151,181,212,243,273,304,334]);
          xAxisGenerator.ticks(11);
          xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
          xAxisGenerator.tickSize(-height)

          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisGenerator);

          // Create a Y scale for densities
          var y = d3.scaleLinear()
            .domain([0, 0.08])
            .range([ height, 0]);

          // Create the Y axis for names
          var yName = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .paddingInner(1)
          svg.append("g")
            .call(d3.axisLeft(yName));

          // Compute kernel density estimation for each column:
          var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
          var allDensity = []
          for (i = 0; i < n; i++) {
              key = categories[i]
              var data0 = data
                .filter(function(d){  return d[key];})

              density = kde( data0
                .map(function(d){  return d[key];}) )

              allDensity.push({key: key, density: density})
          }

          // Add areas
          svg.selectAll("areas")
            .data(allDensity)
            .enter()
            .append("path")
              .attr("transform", function(d){return("translate(0," + (yName(d.key)-height) +")" )})
              .datum(function(d){return(d.density)})
              .attr("fill", "#69b3a2")
              .attr("stroke", "#000")
              .attr("stroke-width", 1)
              .attr("d",  d3.area()
                  .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y1(function(d) { return y(d[1]); })
                  .y0(y(0))
              )

        })

        // This is what I need to compute kernel density estimation
        function kernelDensityEstimator(kernel, X) {
          return function(V) {
            return X.map(function(x) {
              return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
          };
        }
        function kernelEpanechnikov(k) {
          return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
          };
        }
////////////////////////////////////////////////////////////////

document.getElementById('my_dataviz').innerHTML = "";
var graph = document.getElementById('my_dataviz').style.display='block';
// $("my_dataviz").load(location.href+" #my_dataviz>*","");

    });
