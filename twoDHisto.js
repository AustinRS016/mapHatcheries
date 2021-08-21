d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/densityPlotData/WALLACE_R_HATCHERY.csv", function(data) {
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



          // append the svg object to the body of the page
          var svg = d3.select("#histTest")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

          // Add X axis
          var x = d3.scaleLinear()
            .domain([0, 366])
            .range([ 0, width]);
          let xAxisGenerator = d3.axisBottom(x);
          let tickLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          xAxisGenerator.tickValues([0,31,59,90,120,151,181,212,243,273,304,334]);
          // xAxisGenerator.tickValues([31,59,90,120,151,181,212,243,273,304,334,366])

          // xAxisGenerator.ticks(11);
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





        d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/lineChartData/WALLACE_R_HATCHERY.csv", function(data) {


        // set the dimensions and margins of the graph
        var margin = {top: 150, right: 250, bottom: 80, left: 50},
            width = 800 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#lineTest")
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




          svg.append("g")
            .call(d3.axisLeft(y));

          // color palette
          var res = sumstat.map(function(d){ return d.key }) // list of group names
          // console.log(res)
          var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','black','#a65628','#f781bf','black'])

          // Draw the line
          svg.selectAll(".line")
              .data(sumstat)
              .enter()
              .append("path")
                .attr("class", function(d) {
                  var k = d.key
                  k = k.replace(/\s+/g, '-').toLowerCase();
                  return k})
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                  return d3.line()
                    .x(function(d) { return x(d.Year); })
                    .y(function(d) { return y(+d.Count); })

                    (d.values)

                })

        //////////////////////////////////////////////////
        ////// Legend
                var size = 12
                svg.selectAll("myrect")
                  .data(keys)
                  .enter()
                  .append("rect")
                    .attr("class", function(d) {
                      k = d.replace(/\s+/g, '-').toLowerCase();
                      console.log(k)
                        })
                    .attr("x", 510)
                    .attr("y", function(d,i){ return 0 + i*(size+30)}) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("width", size)
                    .attr("height", size)
                    .style("fill", function(d){ return color(d)})
                svg.selectAll("mylabels")
                   .data(keys)
                   .enter()
                   .append("text")
                    .attr("class", function(d) {
                       k = d.replace(/\s+/g, '-').toLowerCase();
                       console.log(k)
                         })
                     .attr("x", 510 + size*1.2)
                     .attr("y", function(d,i){ return 0 + i*(size+30) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                     .style("fill", function(d){ return color(d)})
                     .text(function(d){ return d})
                     .attr("text-anchor", "left")
                     .style("alignment-baseline", "middle")
                     .call(wrap, 200)


        })
