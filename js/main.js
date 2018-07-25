/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/
var margin = {top: 10, right: 10, bottom: 100, left:100};

var width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var year = 0;

var t  = d3.transition().duration(299);

var x = d3.scaleLog()
    .range([0,width])
		.base(2);

var y = d3.scaleLinear()
    .range([height,0]);

var r = d3.scaleLinear()
		.range([5,30]);

		var color = d3.scaleOrdinal()
			.range(["#f00","#0f0","#00f","#f0f","#0ff","#f0f","#ff0","#000"]);

  var svg = d3.select('#chart-area')
      .append('svg')
      .attr('width',width + margin.left + margin.right)
      .attr('height',height + margin.top+margin.bottom);

  var g = svg.append("g")
      .attr("transform","translate("+margin.left+","+margin.top+")");

  var xAxisGroup =  g.append("g")
        .attr("class","x-axis")
        .attr("transform","translate(0,"+height+")")


  var yAxisGroup = g.append("g")
          .attr("class","y-axis");

  g.append("text")
        .attr("class","x axis-label")
        .attr("x",width/2)
        .attr("y",height +margin.top+margin.bottom-40)
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .text("GDP Per Capita ($)");

var yLabel = g.append("text")
          .attr("class","y axis-label")
          .attr("x", - (height / 2))
          .attr("y",-70)
          .attr("font-size","20px")
          .attr("text-anchor","middle")
          .attr("transform","rotate(-90)")
          .text("Life Expetancy (Years)");

var yearLabel = g.append("text")
				.attr("class","x axis-label")
				.attr("x",width - 80)
				.attr("y",height - 40)
				.attr("font-size","40px")
				.attr("fill","gray")
				.text("1800")

d3.json("data/data.json").then(function(data){
	//console.log(data);

	data.forEach(function(d){
    d.countries.forEach(function(j){
			if(j.income==null) {
				j.income = 1;
			}
			if(j.life_exp==null) {
				j.life_exp = -999;
			}
			if(j.population==null) {
				j.population = 0;
			}
		})
  });

		color.domain(data[year].countries.map(function(d){
			return d.continent;}));

			var legendsq = g.selectAll('.rectleg')
			.data(color.domain());

			var legends = g.selectAll('.textleg')
			.data(color.domain());


			legendsq.enter()
				.append('rect')
					.attr("class","rectleg")
					.attr("x",width-60)
					.attr("y",function(d,i){return i*10+10;})
					.attr("width","10")
					.attr("height",8)
					.attr("fill",function(d){ return color(d); });

				legends.enter()
					.append('text')
						.attr("class","textleg")
						.attr("x",width-46)
						.attr("y",function(d,i){return i*10+17;})
						.text(function(d){ return d; })
						.attr("fill","black")
						.attr("font-size","13px");

;
 update(data[213]);

	d3.interval(function () {
		year = year + 1;
		if(year >= 215) {
			year = 0;
		}


    var newData = data[year];
    update(newData);
  }, 300);


})


function update(data) {

  x.domain([200,150000]);

  y.domain([0,90]);

	var max = d3.max(data.countries,function(d){
		return d.population;
	});

	r.domain([0,max]);

    var xAxisCall = d3.axisBottom(x)
//			.ticks(3)
//			.tickFormat(function(d){ return(d);})
				.tickValues([400,4000,40000]);

    xAxisGroup.transition(t).call(xAxisCall);


      var yAxisCall = d3.axisLeft(y)
        .ticks(10)
        .tickFormat(function(d){
          return d;
        });

    yAxisGroup.transition(t).call(yAxisCall);


  //JOIN new Data with Old Elements
  var rects = g.selectAll('circle')
    .data(data.countries, function(d){
      return d.country;
    });



//EXIT old elements not present in new data
rects.exit()
  .attr("fill","#ddf")
  .transition(t)
    .attr("cy",y(0))
    .attr("r",0)
  .remove();

//ENTER new elements present in new data
    rects.enter()
      .append("circle")
        .attr("cx",function(d,i){ return x(d.income)-r(d.population); })
        .attr("r",0)
        .attr("cy",y(0))
        .attr("fill-opacity",0)
        .attr("fill","grey")
				.append("svg:title")
				 .text(function(d, i) { return d.country; })
      .merge(rects)
      .transition(t)
          .attr("fill-opacity",1)
          .attr("cx",function(d,i){ return x(d.income)-r(d.population); })
          .attr("cy",function(d){ return y(d.life_exp); })
          .attr("r",function(d){ return r(d.population); })
					.attr("fill",function(d){return color(d.continent); });

		yearLabel.text(data.year);

}

function toCamelCase(str){
  return str.split(' ').map(function(word,index){
    // If it is the first word make sure to lowercase all the chars.
    if(index == 0){
      return word.toLowerCase();
    }
    // If it is not the first word only upper case the first char and lowercase the rest.
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}
