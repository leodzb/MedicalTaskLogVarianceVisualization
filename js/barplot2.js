
var margin = {
    top: 30,
    right: 220,
    bottom: 40,
    left: 65
};


setTimeout(function(){
    barchat();
}, 1000);

function barchat(){

var upperRowWidth = $('#upper').width();
var upperRowHeight = $('.upper-row').innerHeight()-25;
width = upperRowWidth - margin.left - margin.right;
height = upperRowHeight - margin.top - margin.bottom;



var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .2);

var y1 = d3.scale.linear();

var y2 = d3.scale.linear();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 1, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0)
    .tickFormat(d3.time.format('%a %d'));

var yAxis = d3.svg.axis()
    .scale(y2)
    .orient("left")
    .ticks(20);

var nest = d3.nest()
    .key(function (d) {
    return d.key;
});

var nest_date = d3.nest()
    .key(function (d) {
    return d.date;
});

var stack = d3.layout.stack()
    .values(function (d) {
    return d.values;
})
    .x(function (d) {
    return d.year;
})
    .y(function (d) {
    return d.value;
})
    .out(function (d, y0) {
        if(isNaN(y0)) {console.log(d);}
    d.valueOffset = y0;
});
 

var color = d3.scale.category10();
var format = d3.time.format("%m/%d/%y"); //set reader for date.format

var svg = d3.select("#upper").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
         var key = d.key;
         var value = d.value; 
         var lis = "<div><div class='tipInfo'>Task: " + key +"</div> <div class='tipInfo'>number: " + value +  "</div></div>"
        return lis
      });
 

var graph = d3.csv("./athena_deptStem.csv", function(data) {
    // formate data
    data.forEach(function (d) {
        d.date = format.parse(d.date); 
        d.value = +d.value;
    });
    // nest data group by date
    var dataByGroup_date = nest_date.entries(data);


    // calculates sum of all  task per day
    dataByGroup_date.forEach(function (d) {
        var order = d.values.map(function (d) {
            return d.value;
        });
        // console.log(order);
        d.date_wise_sum = d3.sum(order);
        // console.log(d.date_wise_sum);
    });

    var dataByGroup = nest.entries(data);
    stack(dataByGroup);

    //stack_year(dataByGroup_year);
    x.domain(dataByGroup[0].values.map(function (d) {
        return d.date;
    }));
    y0.domain(dataByGroup.map(function (d) {
        return d.key;
    }));
    y1.domain([0, d3.max(data, function (d) {
        return d.value;
    })]).range([y0.rangeBand(), 0]);
    y2.domain([0, d3.max(dataByGroup_date, function (d) {
        return d.date_wise_sum;
    })]).range([height, 0]);

    var group = svg.selectAll(".group")
        .data(dataByGroup)
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", function (d) {
        return "translate(0," + height + ")";
    });
    group.append("text")
        .attr("class", "group-label")
        .attr("x", -150)
        .attr("y", function (d) {
        return y1(d.values[0].value / 2);
    })
        .attr("dy", ".1em")
        .text(function (d) {
        return d.key;
    });

    var rects = group.selectAll("rect")
        .data(function (d) {
        return d.values;
    })
        .enter().append("rect")
        .style("fill", function (d) {
        return color(d.key);
    })
        .attr("class", "bar")
        .attr("x", function (d) {
        return x(d.date);
    })
        .attr("y", function (d) {
        return y2(d.value + d.valueOffset) - height;
    })
        .attr("width", 8)
        .attr("height", function (d) {
        return height - y2(d.value);
    });
    // hide y axis text
    group.selectAll(".group-label").text("");

    // adds y axis on switch to stacked view
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-1, 0 )")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 36)
        .attr("x", "1em")
        .attr("dy", ".91em")
        .style("text-anchor", "end")
        .text("Spread of Task Groups")
		//.attr("font-weight","bold")
        .attr("y", -50);

    // x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(3," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.55em")
        .attr("dy", ".21em")
        .attr("y", ".5em")
        .attr("transform", "rotate(-90)")

    d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function () {
        d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
    }, 2000);

    function change() {
        clearTimeout(timeout);

        if (this.value === "stacked") transitionStacked();
        else transitionMultiples();
    }

    function transitionStacked() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", "translate(0," + height + ")");
        g.selectAll("rect")
            .attr("y", function (d) {
            return y2(d.value + d.valueOffset) - height;
        })
            .attr("height", function (d) {
            return height - y2(d.value);
        });

        g.selectAll(".group-label").text("");

        // adds y axis on switch to stacked view
        svg.append("g")
            .attr("class", "y axis barYaxis")
            .attr("transform", "translate(-1, 0 )")
            .call(yAxis)
            .append("text")
			.attr("text-align","left")
            .attr("transform", "rotate(-90)")
            .attr("y", 36)
            .attr("x", "1em")
            .attr("dy", ".91em")
            .style("text-anchor", "end")
            .text("Spread of Task Groups")
			//.style("font-weight","bold")
            .attr("y", -50);

        if (upperRowHeight<130){
            svg.selectAll(".y.axis").remove();
        }

    }
	
	//dsb
	
	var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(210," + i * 8 + ")"; });

  legend.append("rect")
      .attr("x", width - 5)
      .attr("y", -20)
      .attr("width", 6)
      .attr("height", 6)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 18)
      .attr("y", -15)
      //.attr("dy", ".02em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
	  
	 var heading = svg.selectAll(".heading")
      .data([1])
    .enter().append("g")
      .attr("class", "heading")
      .attr("transform", function(d, i) { return "translate(20,8)"; });
	  
	heading.append("text")
      .attr("x", -20)
      .attr("y", -24)
      //.attr("dy", ".02em")
      .style("fill","green")
      .style("text-align","center")
      .style("font-size","100%")
      .style("font-weight","bold")
      .text("Stacked-Bar chart. Comparison of the distribution of 20 EHR Tasks (see legend) on each of the 30 days, and across them.");

		  
	//dsb  

    function transitionMultiples() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", function (d) {
                return "translate(0," + y0(d.key) + ")";
            });
        g.selectAll("rect").attr("y", function (d) {
            return y1(d.value);// + (y1(d.value))/2;
        })
            .attr("height", function (d) {
            return y0.rangeBand() - y1(d.value);
        });

        g.select(".group-label").attr("y", function (d) {
            return y1(d.values[0].value / 2);
        });
    
        g.selectAll(".group-label").text(function (d) {
            return d.key;
        });
        // removes y axis on switch to multiples view
        svg.selectAll(".y.axis").remove();
    }

    svg.call(tip); 
    svg.selectAll(".bar")
            .attr("opacity", 1)
            .on("mouseover", function(d, i) {
                tip.show(d);
              svg.selectAll(".bar").transition()
              .duration(250)
              .style("stroke", function(d,j){
                return j!=i ? "none": "gray";
              })
              .style("stroke-width", function(d,j){
                return j !=i ? "0px":"1px";
              })
              .attr("opacity", function(d, j) { // set opacity of the layer when mouseover
                return j != i ? 0.5 : 1;
            })})
            .on("mouseout", function(d, i) {
                tip.hide(d);
                 svg.selectAll(".bar")
                  .transition()
                  .duration(250)
                  .attr("opacity", "1")
                  .style("stroke", "none");
              });

    if (upperRowHeight<130){
        svg.selectAll(".y.axis").remove();
    }
});
}
