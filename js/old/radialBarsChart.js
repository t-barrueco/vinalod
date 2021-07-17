/*
*    H2020 CORDIS DATA EXPLORATION
*    main.js
*    
*    created by EuriTrends
*    
*    based on the version of Radial Stacked Bars by M. Bostock at
*    https://bl.ocks.org/mbostock/3686329aa6e1f5938df8eef12ec353fe
*    GNU General Public License, version 3
*    https://opensource.org/licenses/GPL-3.0 
*    
*/



RadialBarsChart = function (_parentElement, _variable, _dataname) {
  this.parentElement = _parentElement;
  this.variable = _variable;
  this.dataname = _dataname;

  this.initVis();
};

/////////////////// initVis Method //////////////////////

RadialBarsChart.prototype.initVis = function () {
  var vis = this;

  vis.pxc = 10;

  vis.margin = { top:vis.pxc, right: vis.pxc, bottom: vis.pxc, left: vis.pxc };

  // set canvas area
  vis.svgWidth = 400;
  vis.svgHeight = 400;

  vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;


  vis.innerRadius = Math.min(vis.width, vis.height) * 0.06;
  vis.outerRadius = Math.min(vis.width, vis.height) * 0.3;


  vis.svg = d3.select(this.parentElement).append("svg")
    .attr('id', vis.variable)
    .attr("viewBox", `0 0 ${vis.svgWidth} ${vis.svgHeight}`);

  // create chart area
  vis.g = vis.svg.append("g").attr("transform", "translate(" + vis.width / 2 + "," + (vis.height / 2 + 20) + ")");

  // set the scales
  vis.x = d3.scaleBand()
    .range([0, 2 * Math.PI]);
  vis.y = d3.scaleRadial()
    .range([vis.innerRadius, vis.outerRadius]);
  vis.z = d3.scaleOrdinal()
    .range(["#5EA8C1"]);


  vis.wrangleData();
};

/////////////////// wrangleVis Method ///////////////////

RadialBarsChart.prototype.wrangleData = function () {
  var vis = this;
  // console.log(vis.variable);
  vis.variable = chart;
  // (vis.variable == "chart1") ? vis.data = chartData_proj : vis.data = chartData_org;
  (vis.variable == "chart1") ? vis.data = dataset1 : vis.data = dataset2;
  (vis.variable == "chart1") ? vis.dataname = dataset1_name : vis.dataname = dataset2_name;

  vis.updateVis();
};

/////////////////// updateVis Method ////////////////////

RadialBarsChart.prototype.updateVis = function () {
  var vis = this;


  vis.x.domain(vis.data.map(d => d.attribute))
    .align(0);
  vis.y.domain([0, d3.max(vis.data, d => d.countpercentage)]);
  vis.z.domain(vis.data.map(d => d.attribute));


  // create a tooltip
  vis.tip = d3.tip()
    .attr('class', 'd3-tip')
    // .style('background', "#cbd5e8")
    .html(function (d) {
      var text = `
            <table class="tiptable" style="margin-left: 2.5px">
            <tr><td class="w-100" style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.description.toUpperCase() + `</span></td></tr>
                <tr><td class="w-50" style="text-align:left;vertical-align:top">Attribute: </td><td class="w-50" style="white-space: nowrap;text-align:right;vertical-align:top;color:#1f77b4;font-weight:`+ ((d.attribute_type == 'identifier') ? "bold" : "") + `\">` + d.attribute + `</td></tr>
                <tr><td class="w-50" style="text-align:left;vertical-align:top">Count of values: </td><td class="w-50" style="white-space: nowrap;text-align:right;vertical-align:top;color:#1f77b4">` + locale.format(",.0f")(d.count) + `</td></tr>
                <tr><td class="w-50" style="text-align:left;vertical-align:top">Count of values %: </td><td class="w-50" style="white-space: nowrap;text-align:right;vertical-align:top;color:#1f77b4">` + ((d.countpercentage == 1) ? d3.format(".0%")(d.countpercentage) : d3.format(".3%")(d.countpercentage)) + `</td></tr>
                <tr><td class="w-50" style="text-align:left;vertical-align:top">Count of unique values: </td><td class="w-50" style="white-space: nowrap;text-align:right;vertical-align:top; color:#1f77b4">` + locale.format(",.0f")(d.uniques) + `</td></tr>
                <tr><td class="w-50" style="text-align:left;vertical-align:top">Attribute type: </td><td class="w-50" style="white-space: nowrap;text-align:right;vertical-align:top;color:` + attributeTypeColor(d.attribute_type)  + `\">` + d.attribute_type + `</td></tr>
                <tr><td><hr></td><td><hr></td></tr>
                <tr><td class="text-info text-center font-weight-bold" >click me!</td></tr>
            </table>`;
      return text;
    });


  vis.g.call(vis.tip);

  vis.t = d3.transition().duration(3000);
  // var t = () => { return d3.transition().duration(1000); };

  vis.path = vis.g.selectAll("path")
    .data(vis.data);

  vis.path.exit().remove();


  vis.path.attr("class", "update")
    .transition(vis.t)
    // .ease(d3.easeLinear)
    .ease(d3.easeBounce)
    .attr("d", d3.arc()
      .innerRadius(function (d) { return vis.y(0); })
      .outerRadius(function (d) { return vis.y(d.countpercentage); })
      .startAngle(function (d) { return vis.x(d.attribute); })
      .endAngle(function (d) { return vis.x(d.attribute) + vis.x.bandwidth(); })
      .padAngle(0.02)
      .padRadius(vis.innerRadius));


  vis.path.enter().append("path")
    .attr('id', "radBars")
    .attr("class", "enter")
    // .attr("class", "shadow")
    .attr('class', d => d.attribute)
    .attr("fill", d => attributeTypeColor(d.attribute_type))
    .attr("fill-opacity", 0.8)
    .attr("stroke", "white")
    .on('mouseover', vis.tip.show)
    .on('mouseout', vis.tip.hide)
    .on("click", d => details(d, vis.variable))
    // .transition(vis.t)
    // .ease(d3.easeBounce)
    .attr("d", d3.arc()
      .innerRadius(function (d) { return vis.y(0); })
      // .outerRadius(function (d) { return vis.y(0); })
      .outerRadius(function (d) { return vis.y(d.countpercentage); })
      .startAngle(function (d) { return vis.x(d.attribute); })
      .endAngle(function (d) { return vis.x(d.attribute) + vis.x.bandwidth(); })
      .padAngle(0.2)
      .padRadius(vis.innerRadius));


  vis.label = vis.g.selectAll("g")
    .data(vis.data)
    .enter().append("g")
    .attr("text-anchor", function (d) { return (vis.x(d.attribute) + vis.x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((vis.x(d.attribute) + vis.x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + (vis.y(d.countpercentage) + 5) + ",5)"; });

  vis.label.append("text")
    .attr('id', d => d.attribute)
    .attr("transform", function (d) { return (vis.x(d.attribute) + vis.x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(-180)translate(0,10)" : ""; })
    .text(function (d) { return d.attribute; })
    // .text(function (d) { return (d.countpercentage < 1) ? d.attribute + "*": d.attribute ; })
    .attr('font-size', d => (d.attribute_type == 'identifier') ? "12px" : "10px")
    .attr('font-weight', d => (d.attribute_type == 'identifier') ? "bold" : "")
    // .attr("stroke", "#336699")
    // .attr("fill", d => (d.countpercentage < 1) ? "red" : "#264d73")
    .attr("fill", d => (d.countpercentage < 1) ? "grey" : attributeTypeColor(d.attribute_type))
    .on('mouseover', vis.tip.show)
    .on('mouseout', vis.tip.hide)
    .on("click", d => details(d, vis.variable));


  // create y ticks circles 

  vis.yAxis = vis.g.append("g")
    .attr("text-anchor", "end");

  vis.yTick = vis.yAxis.selectAll("g")
    // .data(y.ticks(6).slice(1))
    .data(vis.y.ticks(6).slice(1))
    .enter().append("g");

  vis.yTick.append("circle")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-opacity", 0.1)
    .attr("r", vis.y);

  formatPercent = d3.format(".0%");

  vis.yTick.append("text")
    .attr("x", 0)
    .attr("y", function (d) { return -vis.y(d) * 1.02; })
    // .attr("dy", "0.05em")
    // .attr("fill", "#264d73")
    .attr("fill", "black")
    .attr('font-size', "0.5vw")
    .attr("text-anchor", "middle")
    // .attr("stroke", "#336699") //"#fff"
    // .attr("stroke-linejoin", "round")
    // .attr("stroke-width", 0.4)
    .text(vis.y.tickFormat(6, formatPercent));

  // vis.svg.append("text")
  //   .attr("x", 5)
  //   // .attr("y", function (d) { return -vis.y(vis.y.ticks(6).pop()); })
  //   .attr("y", 5)
  //   .attr("dy", "0.6em")
  //   .attr('font-size', "9px")
  //   .attr("fill", "#98abc5")
  //   .attr("text-anchor", "start")
  //   .text(vis.dataname);


  // vis.yAxis.append("text")
  // .attr("x", -vis.width * 0.98 / 2)
  // // .attr("y", function (d) { return -vis.y(vis.y.ticks(6).pop()); })
  // .attr("y", -vis.height / 2.5)
  // .attr("dy", "-1.5em")
  // .attr('font-size', "2.2vw")
  // .attr("fill", "#98abc5")
  // .attr("text-anchor", "start")
  // .text(vis.dataname);



  // create a legend tooltip
  vis.legendtip = d3.tip()
    .attr('class', 'd3-tip')
    // .style('background', "#cbd5e8")
    .html(function (d) {
      var text = `
           <table class="tiptable" style="margin-left: 2.5px">
            <tr><td class="w-25" style="text-align:right;vertical-align:top">Attribute type: </td><td class="w-75" style="text-left: right;vertical-align:top;padding-left: 10px;"><span style='color:` + attributeTypeColor(d) + `\'>` + d + `</span></td></tr>
            <tr><td class="w-25" style="text-align:right;vertical-align:top"> </td><td class="w-75" style="text-align: left;vertical-align:top;padding-left: 10px;word-wrap: break-word;"><span>` + ((d == "info") ? "attribute used to provide information only, it CANNOT be used to cross reference other dataset" : ((d == "identifier") ? "attribute that uniquely identifies a record, it CAN be used to cross reference other dataset" : "attribute with non-unique values that CAN be used to cross reference other dataset")) + `</span></td></tr>
           </table>`;
      return text;
    });
  vis.g.call(vis.legendtip);

  
  // <tr><td>Definition: </td><td style="text-align: right"><span style='color:\''>` + ((d == "info") ? "attribute used to provide information only, it cannot be used to cross reference other dataset" : "attribute") + `</span></td></tr>

  // add legend in the center
  // vis.legend = vis.g.append("g")
  vis.legend = vis.svg.append("g")
    .selectAll("g")
    .data(d3.map(vis.data, d => d.attribute_type).keys().sort())
    .enter().append("g")
    .attr("transform", function (d, i) { return "translate(-35," + (i * 12 + 10) + ")"; })
    .on('mouseover', vis.legendtip.show)
    .on('mouseout', vis.legendtip.hide);


  vis.legend.append("rect")
    .attr("x", 40)
    .attr("y", 4)
    .attr("width", 6)
    .attr("height", 6)
    .attr("fill", d => attributeTypeColor(d))
    .attr("fill-opacity", "0.8");

  // dataset title  
  vis.legend.append("text")
    .attr("x", 50)
    .attr("y", 7)
    .attr("dy", "0.3em")
    .attr('font-size', "9px")
    .attr('font-weight', d => (d == 'identifier') ? "bold" : "")
    // .attr("fill", "#264d73")
    .attr("fill", d => attributeTypeColor(d))
    // .attr("fill-opacity", "0.8")
    .text(d => (d == 'identifier') ? d + " (in bold)" : d);


  vis.svg.append("rect")
    .attr("x", 5)
    .attr("y", 50)
    .attr("width", 6)
    .attr("height", 6)
    // .attr("dy", "0.3em")
    .attr('font-size', "9px")
    .attr("fill", "grey")
    .text("grey ");


  vis.svg.append("text")
    .attr("x", 15)
    .attr("y", 53)
    .attr("dy", "0.3em")
    .attr('font-size', "9px")
    // .attr('font-weight', "bold")
    // .attr("fill", "#264d73")
    .attr("fill", "grey")
    // .attr("fill-opacity", "1.2")
    .text("attributes with null values");


  /////////////////// Helper Functions /////////////////////

  function details(d, chart) {


    if (chart == "chart2") {
      if (showDetails2 == false) {
        $('#remove_details2').show();
        $('#row_button2').show();

        showDetails2 = true;
      };
      $('#openDataset1').removeClass('active');
      $('#openDataset2').addClass('active');
      $('#tab1').removeClass('active');
      $('#tab2').addClass('active');

      var txt1 = "<div class=\"details2 w-100\" ><span class=\"text-info font-weight-bold\" style=\"font-size: 15px;\">" + "   " + d.attribute + "</span></div>";
      var txt2 = "<div class=\"details2 w-100\" ><span class=\" text-info \" >" + "   " + d.description + "</span></div>";
      var txt3 = "<div class=\"details2 w-100\" >values <span class=\" text-info font-weight-bold\">" + "   " + locale.format(",.0f")(d.count) + "</span><span class=\" text-info\" style=\"font-weight:bold" + "\"> [" + ((d.countpercentage == 1) ? d3.format(".0%")(d.countpercentage) : d3.format(".3%")(d.countpercentage)) + "]" + "</span></div>";
      var txt4 = "<div class=\"details2 w-100\" >unique values <span class=\" text-info font-weight-bold\" >" + "   " + locale.format(",.0f")(d.uniques) + "</span></div>";
      var txt5 = "<div class=\"details2 w-100\" >attribute type<span class=\"font-weight-bold\" style=\" color:" + attributeTypeColor(d.attribute_type) + "\">" + "   " + d.attribute_type + "</span></div>";
      var txt6 = "<div class=\"details2 mb-2 w-25\" >min value</div>";
      var txt7 = "<div class=\"details2 mb-2 w-75 text-info\">" + "   " + d.minValue + "</div>";
      var txt8 = "<div class=\"details2 mb-2 w-25\" >max value</div>";
      var txt9 = "<div class=\"details2 mb-2 w-75 text-info\">" + "   " + d.maxValue  + "</div>";
      var txt = txt1 + txt2 + txt3 + txt4 + txt5 + txt6 + txt7 + txt8 + txt9;
      $("#radarChart2_details").after(txt);
      $('html, body').animate({
        scrollTop: $("#remove_details2").offset().top
      }, 1000);
    } else {
      if (showDetails1 == false) {
        $('#remove_details1').show();
        $('#row_button1').show();
        showDetails1 = true;
      };
      $('#openDataset2').removeClass('active');
      $('#openDataset1').addClass('active');
      $('#tab2').removeClass('active');
      $('#tab1').addClass('active');

      var txt1 = "<div class=\"details1 w-100\" ><span class=\"text-info font-weight-bold\" style=\"font-size: 15px;\">" + "   " + d.attribute + "</span></div>";
      var txt2 = "<div class=\"details1 w-100\" ><span class=\"text-info \" >" + d.description + "</span></div>";
      var txt3 = "<div class=\"details1 w-100\" ><span class=\"text-info font-weight-bold\" >" + locale.format(",.0f")(d.count) + "</span><span class=\" text-info\" style=\"font-weight:bold \"> [" + ((d.countpercentage == 1) ? d3.format(".0%")(d.countpercentage) : d3.format(".3%")(d.countpercentage)) + "]  " + "</span> values</div>";
      var txt4 = "<div class=\"details1 w-100\" ><span class=\"text-info font-weight-bold\" >" + locale.format(",.0f")(d.uniques) + "   " + "</span> unique values</div>";
      var txt5 = "<div class=\"details1 w-100\" ><span  class=\"font-weight-bold\" style=\"color:" + attributeTypeColor(d.attribute_type) + "\">" + d.attribute_type + "   " + "</span>  attribute type</div>";
      var txt6 = "<div class=\"details1 mb-2 w-75 text-info\" >" + d.minValue + "</div>";
      var txt7 = "<div class=\"details1 mb-2 w-25\" > min value</div>";
      var txt8 = "<div class=\"details1 mb-2 w-75 text-info\" >" + d.maxValue + "</div>";
      var txt9 = "<div class=\"details1 mb-2 w-25\" > max value</div>";
      var txt = txt1 + txt2 + txt3 + txt4 + txt5 + txt6 + txt7 +txt8 + txt9;
      $("#radarChart1_details").after(txt);
      $('html, body').animate({
        scrollTop: $("#remove_details1").offset().top
      }, 1000);

    }

  };


  function weave(array, compare) {
    var i = -1, j, n = array.sort(compare).length, weave = new Array(n);
    while (++i < n) weave[i] = array[(j = i << 1) >= n ? (n - i << 1) - 1 : j];
    while (--n >= 0) array[n] = weave[n];
  };

  
  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

};
