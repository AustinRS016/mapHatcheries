

d3.csv("https://raw.githubusercontent.com/AustinRS016/capstoneDataRepo/main/lineChartData/MERWIN_DAM_FCF.csv", function(data){

var categories = data.columns


// group the data: I want to draw one line per group
var dataset = d3.nest() // nest function allows to group the calculation per level of a factor
  .key(function(d) { return d.Run; })
  .entries(data);
var labels = (d3.groups(dataset, d=> d.key))
  .map(function(arr){ return arr[0];})


var xAxis = d3.groups(data, d => d.Year)
  .map(function(arr){return arr[0];})


console.log(xAxis)
console.log(dataset)
console.log(labels)

Chart.defaults.font.size = 16;
  var fishLabels = data.map(function(d) {return d.Run})
  let chart = new Chart('chart', {
    responise: true,
     type: 'line',
     data: {
       labels: xAxis,
       datasets: []
     },
     options: {
       plugins: {
         title: {
           display: true,
           text: 'Yearly Salmon/Steelhead Returns',
           padding: {
             top: 10,
             bottom: 3
           },
           font: {
             size: 34
           },
         },
         subtitle: {
           display: true,
           text: 'Click a legend item to hide/show it. Hover over a line to get the raw count.',
           font: {
             style: 'italic'
           },
           padding:{
             bottom: 7
           }
         }
       }
     }
   });

colors = ['#900C3F','#C70039','#FF5733','#FFC300','#3B6013','#156013','#136038','#13605E','#133B60','#131460','#2C8AC9','#C9AC2C','#98C92C','#FF6FFA','#FF6FB2','#FF746F','#FFBC6F']

 for (var i = 0; i < labels.length; i++) {
    var l = (dataset[i].key)
    var d = d3.map(dataset[i].values, d => d.Count)
    chart.data.datasets.push({
     label: l,
     data: d,
     fill: false,
     borderColor: colors[i]
    })
   };

   chart.update();

$("#toggle".click(function() {
  chart.data.datasets.forEach(function(ds) {
    ds.hidden = !ds.hidden;

  });
  chart.update();
}))
 })
