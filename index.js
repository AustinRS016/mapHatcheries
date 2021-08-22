////////////////////////////////////////////////////////////////////

////  Map
mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcTRidmgwOWdpMnNxc3NmaHE5OXg1In0.va6GbxRjrFnzt6QWT_bwfQ';
var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/austinrs16/ckoqf7lh646z517msf4mttqe9', // style URL
  center: [-121.2, 47.5], // starting position as [lng, lat]
  zoom: 7.3, // starting zoom
});

var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = (Math.floor(diff / oneDay) -1);
var day = String(day)
console.log(day)





map.on('load', function(){


map.addSource('hatch',{
       "type": "geojson",
       "data": "jsons/hatcheries.geojson"
   });

map.addSource('KDE', {
  'type': 'geojson',
  'data': 'jsons/geoSalKDE.geojson'
});

map.addLayer({
  'id':'sockeye',
  'type':'circle',
  'source':'KDE',
  'layout':{'visibility':'none'},
  'paint': {
    'circle-color': 'red',
    'circle-radius': 10
      },
  "filter":['all',
    ['==', 'Species','Sockeye' ],
    ['!=', day, '0.0']]
});
map.addLayer({
  'id':'pink',
  'type':'circle',
  'source':'KDE',
  'layout':{'visibility':'none'},
  'paint': {
    'circle-color': 'pink',
    'circle-radius': 10
      },
  "filter":['all',
    ['==', 'Species','Pink' ],
    ['!=', day, '0.0']]
});
map.addLayer({
  'id':'steelhead',
  'type':'circle',
  'source':'KDE',
  'layout':{'visibility':'none'},
  'paint': {
    'circle-color': 'orange',
    'circle-radius': 10
      },
  "filter":['all',
    ['==', 'Species','Steelhead' ],
    ['!=', day, '0.0']]
});
map.addLayer({
  'id':'chum',
  'type':'circle',
  'source':'KDE',
  'layout':{'visibility':'none'},
  'paint': {
    'circle-color': 'green',
    'circle-radius': 10
      },
  "filter":['all',
    ['==', 'Species','Chum' ],
    ['!=', day, '0.0']]
});
map.addLayer({
  'id':'chinook',
  'type':'circle',
  'source':'KDE',
  'layout':{'visibility':'none'},
  'paint': {
    'circle-color': 'yellow',
    'circle-radius': 10
      },
  "filter":['all',
    ['==', 'Species','Chinook' ],
    ['!=', day, '0.0']]
});
map.addLayer({
  'id':'coho',
  'type':'circle',
  'source':'KDE',
  'layout':{'visibility':'none'},
  'paint': {
    'circle-color': 'blue',
    'circle-radius': 10
      },
  "filter":['all',
    ['==', 'Species','Coho' ],
    ['!=', day, '0.0']]
});

map.addLayer({
     "id":"hatch",
     "type":"circle",
     "source":"hatch",
     "layout": {'visibility': 'visible'},
     "paint": {
          },
   });
 });

map.on('idle', () => {
const toggLayers = ['pink','chum','steelhead','coho','chinook','sockeye'];

for (const id of toggLayers) {
  if (document.getElementById(id)) {continue;}

const link = document.createElement('a');
link.id = id;
link.href = '#';
link.textContent = id;
link.className = 'active';

link.onclick = function(e) {
  const clickedLayer = this.textContent;
  e.preventDefault();
  e.stopPropagation();

  const visibility = map.getLayoutProperty(clickedLayer,'visibility');

  if (visibility === 'visible') {map.setLayoutProperty(clickedLayer, 'visibility', 'none'); this.className = '';}
  else {this.className = 'active'; map.setLayoutProperty(clickedLayer,'visibility','visible');}

};
  const layers = document.getElementById('menu');
  layers.appendChild(link);
}
});


///////////////////////////////////////////////////////////////////
/////  Function to query data visualizations
 map.on('click', 'hatch', function (e) {
   console.log(e.features[0].properties['Facility'])
//////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
/////  Text Wrap Function
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

/////////////////////////////////////////////////////////////////
/////// Histograms
d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/densityPlotData/" + e.features[0].properties['Facility'] + ".csv", function(data) {
          // set the dimensions and margins of the graph
          var margin = {top: 60, right: 20, bottom: 20, left:150},
              width = 800 - margin.left - margin.right;



          // Get the different categories and count them
          var categories = data.columns
          var n = categories.length
          if (n > 3){
            var height = n * 30
          }
          else {
            var  height = n * 20;

          }
          if (n > 3){
            var yDom = .2
          }
          else{
            var yDom = .05
          }
          console.log(n)



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
            .domain([0, 365])
            .range([ 0, width]);
          let xAxisGenerator = d3.axisBottom(x);
          let tickLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          xAxisGenerator.tickValues([0,31,59,90,120,151,181,212,243,273,304,334]);

          xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
          xAxisGenerator.tickSize(-height)



          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisGenerator)
            .select(".domain").remove();

          // Create a Y scale for densities
          var y = d3.scaleLinear()
            .domain([0, yDom])
            .range([ height, 0]);

          // Create the Y axis for names
          var yName = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .paddingInner(1)
          svg.append("g")
            .call(d3.axisLeft(yName));


          // Compute kernel density estimation for each column:
          var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(80)) // increase this 40 for more accurate density.
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
        });
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
document.getElementById('my_dataviz').innerHTML = "";
// document.getElementById('histBox').innerHTML = "";
document.getElementById('my_dataviz').style.display='block';
document.getElementById('histBox').style.display='block'
////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
///// Line Chart
d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/lineChartData/" + e.features[0].properties['Facility'] + ".csv", function(data) {


// set the dimensions and margins of the graph
var margin = {top: 20, right: 250, bottom: 80, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#lineChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Run; })
    .entries(data);
  var keys = (d3.groups(sumstat, d=> d.key))
    .map(function(arr){ return arr[0];})


  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d) { return +d.Count; })])
    .range([ height, 0 ]);


        console.log(d3.max(data, function(d) { return +d.Count; }))


  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#9c863a','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("class", "myLine")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(+d.Count); })

            (d.values)
        })

///////////////////////////////////////////////////////////////////////////////
///Hover on line





//////////////////////////////////////////////////
////// Legend
        var size = 12
        svg.selectAll("myrect")
          .data(keys)
          .enter()
          .append("rect")
            .attr("x", 510)
            .attr("y", function(d,i){ return 0 + i*(size+30)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})
        svg.selectAll("mylabels")
           .data(keys)
           .enter()
           .append("text")
             .attr("x", 510 + size*1.2)
             .attr("y", function(d,i){ return 0 + i*(size+30) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
             .style("fill", function(d){ return color(d)})
             .text(function(d){ return d})
             .attr("text-anchor", "left")
             .style("alignment-baseline", "middle")
             .call(wrap, 200)


})


document.getElementById('lineChart').innerHTML = "";
document.getElementById('lineChart').style.display='block';
document.getElementById('lineBox').style.display='block'
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
///River Chart
  cacheDtTm = new Date().getTime();
  parm = '00060'
  hydrograph_url = "http://waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS&site_no="  + e.features[0].properties.river_gauge + "&parm_cd=00060&period=7&cacheTime=" + cacheDtTm;
                    // http://waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS&site_no=01646500&parm_cd=00060&period=7&cacheTime=1628470410259
  hydrograph = '<a><img src="'+hydrograph_url+'" id="riverChart" height="500" width="600"/></a>';
  console.log(e.features[0].properties.river_gauge)
  if (e.features[0].properties.river_gauge == ""){
    document.getElementById('graph').innerHTML = "";
  }else{
    $('#graph').html(hydrograph);
  }
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
///Weather Forecast
const hatchLat = e.features[0].geometry.coordinates[1]
const hatchLon = e.features[0].geometry.coordinates[0]

$.getJSON("https://api.openweathermap.org/data/2.5/onecall?lat="+ hatchLat +"&lon="+ hatchLon +"&exclude=hourly,minutely&units=imperial&appid=c6e7120c57d9cf83d3bdb078b1beb1f1",  // url
                function(data){
                document.getElementById('weather').innerHTML = "";
                document.getElementById('weather').style.display='flex';
                var categories = data.daily

                var n = 6
                for (i=1; i<n; i++){

                  var icon = categories[i].weather[0].icon
                  var max = categories[i].temp.max
                  var min = categories[i].temp.min
                  var dt = categories[i].dt
                  var d = new Date(dt * 1000)
                  var weekDay = d.toLocaleString('en-US',{weekday:'short'})

                  if (categories[i].rain == undefined){
                    var precip = 0
                    }
                  else{
                    var precip = categories[i].rain
                    }

                  var node = document.createElement("div")
                      node.className = "daily";

                  var h = document.createElement("h3")
                      h.className = "weatherHeader"
                  var head = document.createTextNode(weekDay)
                      node.appendChild(head)

                  var img = document.createElement("img")
                      img.src = "http://openweathermap.org/img/wn/" +icon+ "@2x.png"
                      node.appendChild(img);

                  var ul = document.createElement("ul")
                      ul.className = "weatherStats";

                  var lmax = document.createElement("LI")
                  var maxNode = document.createTextNode("High: " + max)
                      lmax.appendChild(maxNode)
                      ul.appendChild(lmax)

                  var lmin = document.createElement("LI")
                  var minNode = document.createTextNode("Low: " + min)
                      lmin.appendChild(minNode)
                      ul.appendChild(lmin)

                  var lprecip = document.createElement("LI")
                  var pNode = document.createTextNode("Precip: " + precip+"mm")
                      lprecip.appendChild(pNode)
                      ul.appendChild(lprecip)

                  node.appendChild(ul);

                  document.getElementById("weather").appendChild(node);
              }
            });
////////////////////////////////////////////////////////////////
document.getElementById('facilityName').innerHTML = "";
document.getElementById('facilityName').style.display='block';
var text = document.createTextNode(e.features[0].properties['Facility Name'])
console.log(text)
document.getElementById('facilityName').appendChild(text)


  });
