// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#twodHisto")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv("https://raw.githubusercontent.com/AustinRS016/D3/main/Coho_WALL.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([250, 350])
    .range([0,420]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([50,40000])
    .range([360,0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Prepare a color palette
  var color = d3.scaleLinear()
      .domain([0, 1]) // Points per square pixel.
      .range(["white", "#69b3a2"])

  // compute the density data
  var densityData = d3.contourDensity()
    .x(function(d) { return x(d.Day);  })
    .y(function(d) { return y(d.Flow); })
    .size([width, height])
    .bandwidth(7)
    .thresholds(8)
    .cellSize(6)
    (data)


  // show the shape!
  svg.insert("g", "g")
    .selectAll("path")
    .data(densityData)
    .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", function(d) { return color(d.value); })
})
