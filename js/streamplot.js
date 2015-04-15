
var dep_id = "overview";
var datearray = [];
var colorrange = [];
var subtitleTxt = "Overall View";

var csvpath = "./athena_deptStem.csv";
var color = "blue";

setTimeout(function(){
  streamChart();
}, 1000);


// onchange department id
$("#departmentID").change(function(){
  dep_id = $(this).val()
  var datearray = [];
  var colorrange = [];
  var subtitleTxt = "Overall View";
  $(".departIDtxt p").remove();
  $(".chart svg").remove();

  if (dep_id == "overview"){
    streamChart();
  }
  else {
    streamChart();
  }
}); // end of onchange

// Main Function
function streamChart(){

if (color == "blue") {
  colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
  colorrange = ["#053061", "#2166ac", "#4393c3", "#92c5de", "#d1e5f0", "#f7f7f7", "#fddbc7", "#f4a582", "#d6604d", "#b2182b", "#67001f"]

}
else if (color == "pink") {
  colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
}
else if (color == "orange") {
  colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];

}

strokecolor = colorrange[0];

var format = d3.time.format("%m/%d/%y"); //set reader for date.format
// size and margin

var upperRowWidth = $('.lower-left').width();
var upperRowHeight = $('.lower-left').innerHeight()-40;


var margin = {top: 20, right: 40, bottom: 20, left: 40};
var width = upperRowWidth - margin.left - margin.right;
var height = upperRowHeight - margin.top - margin.bottom;

// Create a tip abstract to show detail
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");


var x = d3.time.scale() // use scale to set range
    .range([0, width]);

var y = d3.scale.linear()
    .range([height-10, 0]);

var z = d3.scale.ordinal() // ordinal axis range
    .range(colorrange);

var xAxis = d3.svg.axis() // set x-axis at bottom
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.weeks);

var yAxis = d3.svg.axis() //map scale of y axis
    .scale(y);

var yAxisr = d3.svg.axis()
    .scale(y);

var stack = d3.layout.stack() // create a silhouette stream stack logic
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3.nest() // create a nest dictionary structure interperator
    .key(function(d) { return d.key; });


var area = d3.svg.area()
    .interpolate("cardinal") // line shape like cardinal line
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

// set size of plot
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read data and pass it into 2-d presentation
var filters = {'dep_id':dep_id};

// read file start 
var graph = d3.csv(csvpath, function(data) {
  // get process of data if dep_id is given
  if (data[0].hasOwnProperty('dep_id')){
    subtitleTxt = "DepartmentID: " + dep_id.toString();
    data = data.filter(function(row) {
      return row['dep_id'] == dep_id;
    })
  }
  
  data.forEach(function(d) {
    d.date = format.parse(d.date); // read and parse date
    d.value = +d.value; // parse value
  });

  var layers = stack(nest.entries(data)); // call stack function
  // set domain of x and y
  x.domain(d3.extent(data, function(d) { return d.date; })); 
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers) // pass structured layer of data
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); }); // call z and fill color

  d3.select(".departIDtxt").append("p")
      .text(subtitleTxt);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
// create y axis at right
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis.orient("right"));
// create y axis at left
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.orient("left"));
// create mouseover function 
  svg.selectAll(".layer")
    .attr("opacity", 1)
    .on("mouseover", function(d, i) {
      svg.selectAll(".layer").transition()
      .duration(250)
      .attr("opacity", function(d, j) { // set opacity of the layer when mouseover
        return j != i ? 0.6 : 1;
    })})

//  get info when mouse move on the canvas
    .on("mousemove", function(d, i) {
      // console.log(d.values[0].date);
      mousex = d3.mouse(this);
      mousex = mousex[0];
      // console.log(mousex);
      var invertedx = x.invert(mousex);
      invertedx = invertedx.getMonth() + invertedx.getDate();
      var selected = (d.values);
      // console.log(selected);
      for (var k = 0; k < selected.length; k++) {
        datearray[k] = selected[k].date;
        datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
      }
      mousedate = datearray.indexOf(invertedx);
      pro = d.values[mousedate].value;
      mmdd = d.values[mousedate].date;
      mmdd = mmdd.toDateString()
      
      // mouse hover and out
      d3.select(this)
      .classed("hover", true)
      .attr("stroke", strokecolor)
      .attr("stroke-width", "0.5px"), 
      tooltip.html("<ul id='tipInfo'><li>Date: " + mmdd + "</li> <li>Task: "+ d.key + "</li><li> Number: " + pro +  "</li></ul>" ).style("visibility", "visible")
      .style("left", (d3.event.pageX +10) + "px")
      .style("top", (d3.event.pageY-60) + "px");
      
    })
    .on("mouseout", function(d, i) {
     svg.selectAll(".layer")
      .transition()
      .duration(250)
      .attr("opacity", "1");
      d3.select(this)
      .classed("hover", false)
      .attr("stroke-width", "0px"), tooltip.html("<ul id='tipInfo'><li>Date: " + mmdd + "</li> <li>Task: "+ d.key + "</li><li> Number: " + pro +  "</li></ul>" ).style("visibility", "hidden");
  })
    //  the vertical line following the mouse
  var vertical = d3.select(".chart")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "1px")
        .style("height", "380px")
        .style("position", "absolute")
        .style("background", "#fff");

  d3.select(".chart")
      .on("mousemove", function(){  
         mousex = d3.mouse(this);
         mousex = mousex[0]+12;
         vertical.style("left", mousex + "px" )})
      .on("mouseover", function(){  
         mousex = d3.mouse(this);
         mousex = mousex[0]+12;
         vertical.style("left", mousex + "px")});
}); // read file end
}  // end of main function

