
// dep_id  key value   date
// 6   Assess & Diagnose   3   6/1/12
// 6   Assess & Diagnose   0   6/2/12
// 6   Assess & Diagnose   0   6/3/12
// 6   Assess & Diagnose   8   6/4/12
//   console.log(data);

var format = d3.time.format("%m/%d/%y"); //set reader for date.format

var myrows;
d3.csv("./athena_deptStem.csv", function(rows) {
    rows.forEach(function(d) {

        d.value = parseInt(d.value);
        // d.date = parseInt(d.date);
        // d.date = format.parse(d.date)
    });
    // console.log(rows);
    var myrows = rows;
    var visualization = d3plus.viz()
    .container("#viz")
    .data(myrows)
    .type("box")
    .id("date")
    .x("key")
    .y("value")
    // .zoom("value")
    // .time("date")
    .ui([{ 
        "label": "Visualization Type",
        "method": "type", 
        "value": ["box"]
      }])
    .draw()

});