export const lineChartD3 = {
    name: "D3 LineChart",
	uniqueId: '',
    actions: {
        getHTML: function () {
            var uniqId = "linechart" + Math.floor((Math.random() * 1000) + 1);
			this.uniqId = uniqId;
			return '<div><select class="listGroup" id="listGrp' + uniqId + '"></select><div class="d3-linechart" id="' + uniqId + '" ></div></div>';
        },
        getLabelName: function () {
            return "linechart D3";
        },
        getName: function () {
            return 'D3LineChart';
        },
        getCategory: function () {
            return 'chart';
        },
        getIcon: function () {

        },
        getUniqueClass: function () {
            return 'd3-linechart';
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
			var xField, yField, xTitle, yTitle, xColor, yColor, xLineColor;
			var pointsData = [];
			var margin = propObject.margin;
			var width = 800 - margin.left - margin.right;
            var height = 400 - margin.top - margin.bottom;
			var svg = d3.select('#' + id)
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");
			/*Initializing x,y fields*/
			xField = propObject.xField;
			yField = propObject.yField;
			
			dataObj.forEach((data, index) => {
				Array.prototype.push.apply(pointsData, data.data);
			});

			// Initialize chart title
			if (propObject.chartTitle) {
				svg.append("text")
					.attr("x", (width / 2))
					.attr("y", 0 - (margin.top / 2))
					.attr("text-anchor", "middle")
					.style("font-size", "20px")
					.style("fill", propObject.chartTitleColor)
					.style("text-decoration", "underline")
					.text(propObject.chartTitle);
			}

			var x = d3.scaleLinear()
				.domain(d3.extent(pointsData, function (d) { return d[xField]; }))
				.range([0, width]);
			var xAxis = svg.append("g").attr("id", "xaxis")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// Add Y axis
			var y = d3.scaleLinear()
				.domain(d3.extent(pointsData, function (d) { return d[yField]; }))
				.range([height, 0]);
			var yAxis = svg.append("g").attr("id", "yaxis").call(d3.axisLeft(y));

			if (propObject.axisInfo.yAxis.length === 1) {
				yTitle = propObject.axisInfo.yAxis[0].title;
				yColor = propObject.axisInfo.yAxis[0].color;
			}
			// Adding single or multiple labels
			var props =  propObject.axisInfo.xAxis.length;
			propObject.axisInfo.xAxis.forEach((xData, index) => {
				// Adding label to x-axis.
				xAxis.append("text")
					.attr("x", (height * (index + 1)) / (props))
					.attr("y", margin.bottom)
					.text(xData.title)
					.attr("font-family", "sans-serif")
					.attr("font-size", "20px")
					.attr("fill", xData.color);
				});

			// Adding label to y-axis
			yAxis.append("text")
				.attr("x", -(height / 4) - margin.left)
				.attr("y", - (margin.left / 2))
				.text(yTitle)
				.attr("font-family", "sans-serif")
				.attr("font-size", "20px")
				.attr("fill", yColor)
				.attr('transform', 'rotate(-90)')
				.attr('text-anchor', 'middle');

			// code for dotted Axis
			if (propObject.dottedAxis) {
				xAxis.attr("class", "line")
					.style("stroke-dasharray", ("3, 3"));

				yAxis.attr("class", "line")
					.style("stroke-dasharray", ("3, 3"));
			}

			// Adding background image
			if (propObject.backgroundImage) {
				svg.append("image")
					.attr("xlink:href", propObject.backgroundImage)
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", width)
					.attr("height", height)
					.attr("id", "fillImage");
			}

			// adding background color
			if (propObject.backgroundColor) {
				svg.append("rect")
					.attr("width", width)
					.attr("height", height)
					.attr("fill", propObject.backgroundColor);
				svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			}

		   // Initializing a tooltip
			var Tooltip = d3.select('#' + id)
				.append("span")
				.style("opacity", 0)
				.attr("class", "tooltip")
				.style("background-color", "white")
				.style("border", "solid")
				.style("border-width", "2px")
				.style("border-radius", "5px")
				.style("padding", "5px")
				.style("position", "absolute")
			// Three function that change the tooltip when user hover / move / leave a cell
			var mouseover = function (d) {
				Tooltip
					.style("opacity", 1)
			}
			var mousemove = function (d) {
				Tooltip
					.html(xField + " : " + d[xField] + "<br/>" + yField + " : " + d[yField])
					.style("left", (d3.mouse(this)[0] + 50) + "px")
					.style("top", (d3.mouse(this)[1]) + "px")
			}
			var mouseleave = function (d) {
				Tooltip
					.style("opacity", 0)
			}

			// Initialize line with group a
			var line = svg.append('g')
				.attr("clip-path", "url(#clip)");			
			if (propObject.dottedGraph) {
				line.attr("class", "line")
					.style("stroke-dasharray", ("3, 3"));
			}

			dataObj.forEach((data, index) => {
				line.append("path").attr("id", "linepath")
					.datum(data.data).attr("class", "line")
					.attr("d", d3.line()
						.x(function (d) { return x(+d[xField]) })
						.y(function (d) { return y(+d[yField]) })
					)
					.attr("stroke", propObject.axisInfo.xAxis[index].lineColor)
					.style("stroke-width", 1)
					.style("fill", "none");
			});
			
			var dot = svg
				.selectAll('circle')
				.data(pointsData)
				.enter()
				.append('circle')
				.attr("cx", function (d) { return x(+d[xField]) })
				.attr("cy", function (d) { return y(+d[yField]) })
				.attr("r", 3)
				.style("fill", "#8acde6")

			/*Initializing tooltip*/
			if (propObject.tooltip) {
				svg.selectAll('circle')
					.on("mouseover", mouseover)
					.on("mousemove", mousemove)
					.on("mouseleave", mouseleave)
			}
			//d3.selectAll('.axis').remove();
			//Add a clipPath: everything out of this area won't be drawn.
			if (propObject.zoom) {
				var clip = svg.append("defs").append("svg:clipPath")
					.attr("id", "clip")
					.append("svg:rect")
					.attr("width", width )
					.attr("height", height )
					.attr("x", 0)
					.attr("y", 0);
				// Add brushing
				var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
					.extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
					.on("end", updateChart)
				// Add the brushing
				line
					.append("g")
					.attr("class", "brush")
					.call(brush);
				var idleTimeout
                function idled() { idleTimeout = null; }
				function updateChart() {

					var selectedName = d3.select(".listGroup").property("value");
					// What are the selected boundaries?
					extent = d3.event.selection

					// If no selection, back to initial coordinate. Otherwise, update X axis domain
					if (!extent) {
						if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
						x.domain([4, 8])
					} else {
						x.domain([x.invert(extent[0]), x.invert(extent[1])])
						line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
					}
					// Update axis and line position
					xAxis.transition().duration(1000).call(d3.axisBottom(x))
					line
						.select('.line')
						.transition()
						.duration(1000)
						.attr("d", d3.line()
							.x(function (d) { return x(d.time) })
							.y(function (d) { return y(d.valueA) })
						)

					dot
						.data(dataObj[0])
						.transition()
						.duration(1000)
						.attr("cx", function (d) { return x(+d.time) })
						.attr("cy", function (d) { return y(+ d[selectedName] || d.value) });

				}
			}

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
						var newProps = Object.assign(_this.getDefaultConfigs(), propObject);
						_this.setData(newProps, dataObj, _this.uniqId);
					}
				};

				document.getElementsByTagName('head')[0].appendChild(script);
			})


		},
		loadScript: function () {

		},
        getDefaultConfigs: function () {
            return { 
				zoom: false, 
				margin: { top: 40, right: 100, bottom: 50, left: 60 }, 
				tooltip: false,
				axisInfo: [{
						title: 'X Axis',
						color: 'red',
					}],
					yAxis:  [{
						title: 'Y Axis',
						color: 'red',
					}]
				}
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