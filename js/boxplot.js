
// dep_id  key value   date
// 6   Assess & Diagnose   3   6/1/12
// 6   Assess & Diagnose   0   6/2/12
// 6   Assess & Diagnose   0   6/3/12
// 6   Assess & Diagnose   8   6/4/12
//   console.log(data);



setTimeout(function(){
  boxplot();
}, 1000);

function boxplot(){

var format = d3.time.format("%m/%d/%y"); //set reader for date.format

var lowerRowWidth = $('.lower-right').width()-40;
var lowerRowHeight = $('.lower-right').innerHeight()-30;


var myrows;
var graph = d3.csv("./anthena_boxplot.csv", function(rows) {
        rows = rows.filter(function(d){
            d.value = parseInt(d.value);
            if(d.value == 0){
    console.log(d.value);

                return false;
            }

            return true;
        });
        // d.date = parseInt(d.date);
        // d.date = format.parse(d.date)
    // console.log(rows);
    var myrows = rows;
    var visualization = d3plus.viz()
        .container("#box-viz")
        .data(myrows)
        .type("box")
        .id("date")
        .x({"value": "key"})
        .y({"value": "value","scale": "log"})
        .size(3)
        .title("Box Plot")
        .height(lowerRowHeight)
        .width(lowerRowWidth)
        .legend(false)
       .zoom({
    "click": true
    })
        .font({
                "size":6,
            });
    visualization.draw();

});
}

    // d3.selectAll('#d3plus_drawer').style('position','relative')
    // .attr("class", function(){console.log("test")});