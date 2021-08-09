////////////////////////////////////////////////////////////////////

////  Map
mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcTRidmgwOWdpMnNxc3NmaHE5OXg1In0.va6GbxRjrFnzt6QWT_bwfQ';
var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/austinrs16/ckoqf7lh646z517msf4mttqe9', // style URL
  center: [-121.6, 48], // starting position as [lng, lat]
  zoom: 8, // starting zoom
});
map.on('load', function(){


map.addSource('hatch',{
       "type": "geojson",
       "data": "jsons/hatcheries.geojson"
   });
  map.addLayer({
     "id":"hatch",
     "type":"circle",
     "source":"hatch",
     "layout": {'visibility': 'visible'},
     "paint": {
      // 'line-color': '',
    },
   });
    });

///////////////////////////////////////////////////////////////////
/////  Function to query data visualizations
 map.on('click', 'hatch', function (e) {
   console.log(e.features[0].properties['Facility'])
//////////////////////////////////////////////////////////////////

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
          var margin = {top: 60, right: 30, bottom: 20, left:110},
              width = 460 - margin.left - margin.right;



          // Get the different categories and count them
          var categories = data.columns
          var n = categories.length
          var  height = n * 27;
          for (i=0; i<n; i++){
            var tst = (categories[i])
            console.log(tst)
          }


          // var categories = data.columns
          console.log(categories)


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
            .domain([0, 0.2])
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
document.getElementById('my_dataviz').style.display='block';
////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
///// Line Chart
d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/lineChartData/" + e.features[0].properties['Facility'] + ".csv", function(data) {


// set the dimensions and margins of the graph
var margin = {top: 150, right: 250, bottom: 80, left: 50},
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
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

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
function hover(svg, path) {

  if ("ontouchstart" in document) svg
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchmove", moved)
      .on("touchstart", entered)
      .on("touchend", left)
  else svg
      .on("mousemove", moved)
      .on("mouseenter", entered)
      .on("mouseleave", left);

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function moved(event) {
          event.preventDefault();
          const pointer = d3.pointer(event, this);
          const xm = x.invert(pointer[0]);
          const ym = y.invert(pointer[1]);
          const i = d3.bisectCenter(data.Year, xm);
          const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
          path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
          dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
          dot.select("text").text(s.Run);
        }

  function entered() {
          path.style("mix-blend-mode", null).attr("stroke", "#ddd");
          dot.attr("display", null);
        }

  function left() {
          path.style("mix-blend-mode", "multiply").attr("stroke", null);
          dot.attr("display", "none");
          }
        }




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
$.getJSON("https://api.openweathermap.org/data/2.5/onecall?lat="+ hatchLat +"&lon="+ hatchLon +"&exclude=hourly,minutely&appid=c6e7120c57d9cf83d3bdb078b1beb1f1",  // url
                function(data){
                document.getElementById('weather').innerHTML = "";
                document.getElementById('weather').style.display='block';
                var categories = data.daily
                var n = 5
                for (i=0; i<n; i++){
                  var icon = categories[i].weather[0].icon
                  var max = categories[i].temp.max
                  var min = categories[i].temp.min
                  if (categories[i].rain == undefined){
                    var precip = 0
                  }
                  else{
                    var precip = categories[i].rain
                  }
                  var node = document.createElement("div")
                  node.className = "daily";
                  var img = document.createElement("img")
                  img.src = "http://openweathermap.org/img/wn/" +icon+ "@2x.png"
                  var textnode = document.createTextNode("Hi: " + max + " Lo: " + min + " Precip: " + precip)
                  node.appendChild(textnode);
                  node.appendChild(img);
                  console.log(node)
                  document.getElementById("weather").appendChild(node);
                }
                });
////////////////////////////////////////////////////////////////

  });
