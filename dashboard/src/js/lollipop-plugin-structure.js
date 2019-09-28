export const  lollipopChartD3 = {
	name: "D3 LollipopChart",
	uniqueId: '',
	actions: {
		getHTML: function () {
			var uniqId = "lollipop" + Math.floor((Math.random() * 1000) + 1);
			this.uniqId = uniqId;
			return '<style>div.tooltip {position: absolute;text-align: center;width: 60px;height: auto;padding: 2px;font: 12px sans-serif;background: lightsteelblue;border: 0px;border-radius: 8px;pointer-events: none;</style><div><select class="listGroup" id="listGrp' + uniqId + '"></select><select id="lollipop-charttype' + uniqId + '"><option value="">Chart Type</option><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select><div class="d3-lollipop" id="' + uniqId + '" ></div></div>';
		},
		getLabelName: function () {
			return "lollipop D3";
		},
		getName: function () {
			return 'D3LollipopChart';
		},
		getCategory: function () {
			return 'chart';
		},
		getIcon: function () {

		},
		getUniqueClass: function () {
			return 'd3-lollipopChart';
		},
		getConfs: function () {
			return {
				zoom: { type: boolean, values: [true, false], require: false },
				margin: { type: 'object', data: { top: number, bottom: number, left: number, right: number }, required: false },
				listGroup: { type: 'array', axis: '', data: ['a', 'b'], required: false },
				xField: { type: 'string', require: true },
				yField: { type: 'string', require: true },
				tooltip: { type: boolean, values: [true, false], require: false }
			};
		},
		registerEvents: function (id, events) {
			// event registration logic;
		},
		getEvents: function () {
			return [
				{
					pluginselector: '',
					eventName: 'cick',
					eventType: 'mouse'
				}
			];
		},
		getData: function (ID, globalOBJ, gridData, currentevent) {
			return {};
		},
		setData: function (propObject, dataObj, id) {
			console.log('propObject', propObject);
			console.log('dataObj  ', dataObj);
			//setting chart type
			var charttypeElm = d3.select("#lollipop-charttype" + this.uniqId);
			charttypeElm.property("value", 'vertical');
			if (propObject.horizontal) {
				charttypeElm.property("value", 'horizontal');
			}
			//Sorting of data object
			if (propObject.sortOrder) {
				dataObj.sort(function(b, a) {   // sorting by value
				  return a.Value < b.Value;
				});
				dataObj.sort(function(a, b) {   // sorting by country
				  var cntry1 = a.Country.toUpperCase(); // ignore upper and lowercase
				  var cntry2 = b.Country.toUpperCase(); // ignore upper and lowercase
				  if (cntry1 < cntry2) {
					return -1;
				  }
				  if (cntry1 > cntry2) {
					return 1;
				  }

				  // names must be equal
				  return 0;
				});
			}
			
			// set the dimensions and margins of the graph
			var margin = { top: 10, right: 30, bottom: 90, left: 100 };
			if (propObject.vertical) {
				margin = {top: 10, right: 30, bottom: 60, left: 100}
			}
			var width = 460 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			// append the svg object to the body of the page
			var svg = d3.select("#"+this.uniqId).html("")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");

			var axisBottom, axisLeft, axis1, axis2;
			if (propObject.horizontal) {
				propObject.linear = [ height, 0];
				propObject.band = [ 0, width ];
			} else if (propObject.vertical) {
				propObject.linear = [ 0, width ];
				propObject.band = [ height, 0];
			}
			axis1 = d3.scaleBand()
					  .range(propObject.band)
					  .domain(dataObj.map(function(d) { return d.Country; }))
					  .padding(1);
				  
			axis2 = d3.scaleLinear()
					  .domain([0, 13000])
					  .range(propObject.linear);
			if (propObject.horizontal) {
				axisLeft = d3.axisLeft(axis2);
				axisBottom = d3.axisBottom(axis1);
			} else if (propObject.vertical) {
				axisBottom = d3.axisBottom(axis2);
				axisLeft = d3.axisLeft(axis1);
				
			}	
			
			svg.append("g")
			   .attr("transform", "translate(0," + height + ")")
			   .call(axisBottom)
			   .selectAll("text")
			   .attr("transform", "translate(-10,0)rotate(-45)")
			   .style("text-anchor", "end");
			   
			svg.append("g").call(axisLeft);
			if (propObject.horizontal) {
				// Lines
				svg.selectAll("myline")
					.data(dataObj)
					.enter()
					.append("line")
					.attr("x1", function (d) { return axis1(d.Country); })
					.attr("x2", function (d) { return axis1(d.Country); })
					.attr("y1", function (d) { return axis2(d.Value); })
					.attr("y2", axis2(0))
					.attr("stroke", "grey")

				// Circles
				svg.selectAll("mycircle")
					.data(dataObj)
					.enter()
					.append("circle").attr("class","lollipop-circle")
					.attr("cx", function (d) { return axis1(d.Country); })
					.attr("cy", function (d) { return axis2(d.Value); })
					.attr("r", "4")
					.style("fill", "#69b3a2")
					.attr("stroke", "black")
			} else if(propObject.vertical) {
				// Lines
				svg.selectAll("myline")
				  .data(dataObj)
				  .enter()
				  .append("line")
					.attr("x1", function(d) { return axis2(d.Value); })
					.attr("x2", axis2(0))
					.attr("y1", function(d) { return axis1(d.Country); })
					.attr("y2", function(d) { return axis1(d.Country); })
					.attr("stroke", "grey")

				// Circles
				svg.selectAll("mycircle")
				  .data(dataObj)
				  .enter()
				  .append("circle").attr("class","lollipop-circle")
					.attr("cx", function(d) { return axis2(d.Value); })
					.attr("cy", function(d) { return axis1(d.Country); })
					.attr("r", "4")
					.style("fill", "#69b3a2")
					.attr("stroke", "black")
				
			}
			//Adding tooltip to circle
			if (propObject.tooltip) {
				var div = d3.select("body").append("div")
						.attr("class", "tooltip")
						.style("opacity", 0);
				d3.selectAll(".lollipop-circle").on("mouseover", function(d) {
					console.log(123, d);
					   div.transition()
						 .duration(200)
						 .style("opacity", .9);
					   div.html(d.Country+ "<br/>" + d.Value)
						 .style("left", (d3.event.pageX) + "px")
						 .style("top", (d3.event.pageY - 28) + "px");
				   }).on("mouseout", function(d) {
					   div.transition()
						 .duration(500)
						 .style("opacity", 0);
				   });
			}

			var xLabel = 'Country';
			var yLabel = 'Internet Users';
				  var innerWidth = width - margin.left - margin.right;
				  var innerHeight = height - margin.bottom - margin.top;
						
				  var g = svg.append('g')
				  .attr('transform', `translate(${margin.left},${margin.top})`);
			  var xAxisG = g.append('g')
				  .attr('transform', `translate(0, ${innerHeight})`);
			  var yAxisG = g.append('g');
			
			  xAxisG.append('text')
				  .attr('class', 'axis-label')
				  .attr('x', innerWidth / 2)
				  .attr('y', margin.bottom * 1.8)
				  .text(xLabel);
			
			  yAxisG.append('text')
				  .attr('class', 'axis-label')
				  .attr('x', -innerHeight / 2)
				  .attr('y', -margin.left * 1.8)
				  .attr('transform', `rotate(-90)`)
				  .style('text-anchor', 'middle')
				  .text(yLabel);			

	},
	drawChart: function (propObject, dataObj, ID = '.class') {
		var _this = this;
		this.getPluginJsImports().forEach(function (src, index) {
			var script = document.createElement('script');
			script.setAttribute('src', src);
			script.async = false;
			script.onreadystatechange = script.onload = function () {
				if (_this.getPluginJsImports().length - 1 == index) {
					var chartHTML = _this.getHTML();
					d3.select(ID).html(chartHTML);
					//Dynamic changing of chart type
					d3.select("#lollipop-charttype" + _this.uniqId).on("change", function (d) {
					  // recover the option that has been chosen
					  var selectedOption = d3.select(this).property("value");
					  if (selectedOption !== "") {
						  delete propObject.vertical;
						  delete propObject.horizontal;
						  propObject[selectedOption] = true;
						  // run the updateChart function with this selected option
						  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function (data) {
							_this.setData(propObject, data, _this.uniqId);
						   });
					  }
					  
					})
					d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function (data) {
						_this.setData(propObject, data, _this.uniqId);
					});
				}
			};
			document.getElementsByTagName('head')[0].appendChild(script);
		})


	},
	loadScript: function () {

	},
	getDefaultConfigs: function () {
		return { zoom: false, margin: { top: 10, right: 100, bottom: 30, left: 30 }, tooltip: false };
	},
	refresh: function () {
		return '';
	},
	getVersion: function () {
		return "[1.0.0,1.0.1]";
	},
	tooltip: function () {
		return "";
	},
	getPluginJsImports: function () {
		var jsArray = ["https://d3js.org/d3.v4.js", "https://d3js.org/d3-scale-chromatic.v1.min.js"];
		return jsArray;
	},
	getCSSFile: function () {
		var cssArray = [];
		return cssArray;
	},
	updateThemeClasses: function (OBJ) {
		return [];
	}

}
}