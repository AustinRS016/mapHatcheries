d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/densityPlotData/WALLACE_R_HATCHERY.csv", function(data) {
          // set the dimensions and margins of the graph
          var margin = {top: 60, right: 20, bottom: 20, left:150},
              width = 200 - margin.left - margin.right;



          // Get the different categories and count them
          var categories = data.columns
          var n = categories.length
          if (n > 3){
            var height = n * 3
          }
          else {
            var  height = n * 2;
          }
          if (n > 3){
            var yDom = .2
          }
          else{
            var yDom = .05
          }



          // append the svg object to the body of the page
          var svg = d3.select("#densTST")
            .append("svg")
              .attr("width", '100%')
              .attr("height", '100%')
              .attr('viewBox','0 0 '+Math.min(width,height)+ ' '+Math.min(width,height))
              .attr('preserveAspectRatio','xMinYMin')
            .append("g")
              .attr("transform",
                    "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

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
