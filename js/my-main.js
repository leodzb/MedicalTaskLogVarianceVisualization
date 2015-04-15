
// screen resize 
$(function(){
$('.upper-row, .lower-row').css({ height: 0.5* ($(window).innerHeight()-120) });
 $('.mid-row').css({ height: 40 });
 
  $(window).resize(function(){
    $('.upper-row, .lower-row').css({ height: 0.5* ($(window).innerHeight()-120) });
 	$('.mid-row').css({ height: 40 });

	// redraw when resize;
	removeDraw();
	redraw();
  });
});

// right arrow
$( ".right-arrow" ).click(function() {
  $( ".lower-left" )
  	.animate({
	    width: "80%",
	    opacity: 1,
	 }, 1000)
  	.animate({  
            width: "75%" 
    }, 400);
  $(".lower-right")
  	.animate({
	    width: "20%",
	    opacity: 0.6,
	 }, 950)
	.animate({  
        width: "25%" 
    },450);

  	// remove and redraw
	removeDraw();
	setTimeout(function(){
		redraw();
	}, 2000);

});
// end of right arrow

// left arrow
$( ".left-arrow" ).click(function() {
  $( ".lower-right" )
  	.animate({
	    width: "88%",
	    opacity: 1,
	 }, 1000)
  	.animate({  
            width: "85%" 
    }, 400);
  $(".lower-left")
  	.animate({
	    width: "12%",
	    opacity: 0.6,
	 }, 950)
	.animate({  
        width: "15%" 
    },450);

  	// remove and redraw
	removeDraw();
	setTimeout(function(){
		redraw();
	}, 2000);
});
// end of left arrow

// down arrow
$( ".down-arrow" ).click(function() {
	// enbale multiple
 	$('#multiples').attr("disabled", false);
 	
  $( ".upper-row" )
  	.animate({
	    height: 0.8* ($(window).innerHeight()-120),
	    opacity: 1,
	 }, 1000)
  	.animate({  
        height: 0.75* ($(window).innerHeight()-120),
    }, 400);
  $(".lower-row")
  	.animate({
	    height: 0.2* ($(window).innerHeight()-120),
	    opacity: 0.6,
	 }, 950)
	.animate({  
        height: 0.25* ($(window).innerHeight()-120),
    },450);
	$( ".upper-col" )
  	.animate({
	    width: "98%",
	 }, 1000)
  	.animate({  
        width: "95%",
    }, 400);
  	// remove and redraw
	removeDraw();
	setTimeout(function(){
		redraw();
	}, 2000);
});
// end of down arrow

// up arrow
$( ".up-arrow" ).click(function() {
	// disabale multiple
	jQuery("#ticketbtn input[id=multiples]:radio").attr('disabled',true);
	jQuery("#ticketbtn input[id=stacked]:radio").attr('checked',true);

  $( ".lower-row" )
  	.animate({
	    height: 0.85* ($(window).innerHeight()-120),
	    opacity: 1,
	 }, 1000)
  	.animate({  
        height: 0.80* ($(window).innerHeight()-120),
    }, 400);
  $(".upper-row")
  	.animate({
	    height: 0.15* ($(window).innerHeight()-120),
	    opacity: 0.6,
	 }, 950)
	.animate({  
        height: 0.20* ($(window).innerHeight()-120),
    },450);
	$( ".upper-col" )
  	.animate({
	    width: "75%",
	 }, 1000)
  	.animate({  
        width: "70%",
    }, 400);    

	removeDraw();
	setTimeout(function(){
		redraw();
	}, 2000);
});
// end of up arrow

// plus reset arrow
$( ".plus-reset" ).click(function() {
		// disabale multiple
	jQuery("#ticketbtn input[id=multiples]:radio").attr('disabled',true);
	jQuery("#ticketbtn input[id=stacked]:radio").attr('checked',true);
  $( ".lower-row" )
  	.animate({
	    height: 0.5* ($(window).innerHeight()-120),
	    opacity: 1,
	 }, 1000);
  $(".upper-row")
  	.animate({
	    height: 0.5* ($(window).innerHeight()-120),
	    opacity: 1,
	 }, 950);
  $( ".lower-right" )
  	.animate({
	    width: "50%",
	    opacity: 1,
	 }, 1000);
  $(".lower-left")
  	.animate({
	    width: "50%",
	    opacity: 1,
	 }, 950);
	$( ".upper-col" )
  	.animate({
	    width: "70%",
	 }, 950)

	removeDraw();
	setTimeout(function(){
		redraw();
	}, 1100);
});
// end of plus reset 


function removeDraw(){
	$('#upper svg').remove();
	$(".departIDtxt p").remove(); //streamplot title
	$(".chart svg").remove();
	$("#box-viz svg").remove();
	$("#box-viz #d3plus_message").remove();
	$("#box-viz #d3plus_drawer").remove();

}
// redraw when resize;
function redraw() {
	// setTimeout(redraw, 1);

	barchat();
	streamChart();
	boxplot();
}
