function timelineGraph(data){
    var endDate,treaty;
    var formatTime=d3.timeFormat("%m-%d-%Y")
//d3.csv("../data/civilization timelines - civilization timelines.csv",function(data){
    var margin = {top: 30, right: 30, bottom: 30, left: 30}
    ////console.log(data)
/*     d3.select(".modal-header2")
    //.style("background-color","blue")
    .text(function(){
        return "Timeline EU Members";
    }) */
    d3.select(".modal-header2 h2").remove()
    modalHeader2=document.getElementsByClassName("modal-header2")[0]
    //////////console.log(modalHeader2)
    //modalHeader2.className="mb-4"
    modalHeader2.classList.add("mb-4");
    var h2=document.createElement("h2")
    h2.className="text-lg font-medium text-gray-900"
    //h2.innerHTML = node["value"]
    h2.innerHTML = "Timeline EU Members"
    modalHeader2.appendChild(h2);

    var xFormat = "%Y-%m-%d";;
    var parseTime = d3.timeParse("%Y-%m-%d");

    data = data.map(d=>{
        treaty=""
        if(d.endDate){
            ////console.log(d.endDate.value)
            endDate=d.endDate.value
        }
        if(d.treaty){
            treaty=d.treaty.value
        }
        ////console.log(d.startDate.value)
        return {
          org: d.org.value,
          org_desc: d.org_desc.value,
          //timeline: d.timeline,
          start: d.startDate.value,
          end: endDate,
          treaty:treaty
        }
        }).sort((a,b)=>  b.star-a.start);
    ////console.log(data)

    width=1100
    //height=data.length*40
    height=500
    //console.log(height)
    if(d3.select("#modalGraph")){
        d3.select("#modalGraph").remove()
    }
    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    //console.log(document.getElementsByClassName("modal-content2"))
    document.getElementsByClassName("modal-content2")[0].appendChild(div)

    //d3.select("#modalGraph svg").remove()
    //d3.select("#modalGraph iframe").remove()
    svg=d3.select("#modalGraph").append("svg")
    .style("width", width - margin.left + 'px')
    .style("height", height + 'px');

    y= d3.scaleBand()
    //.domain(d3.range(data.length))
    .domain(data.map(d => d.org))
    .range([0,height - margin.bottom - margin.top-200])
    //.range([0,height])
    //.padding(0.2)

    //console.log(y.domain())
    //console.log(y.range())
    //////console.log(y("Aegean civilization"))
    //////console.log(y("Age of pre-colonial civilization (Christian, Islamic, and traditional kingdoms)"))
    //x = d3.scaleLinear()
    x=d3.scaleTime()
      //.domain([d3.min(data, d => d.start), d3.max(data, d => d.end)])
      .domain([d3.min(data, d => parseTime(d.start)), d3.max(data, d => parseTime(d.end))])
      //.domain([0,d3.max(data, d => d.end)])
      .range([margin.left,width - margin.left-margin.right-20])

    var colorScale = d3.scaleOrdinal().domain(y.domain())
      .range(d3.schemeCategory10);

    var tip = d3.tip()
      .attr('class', 'd3-tip z-50')
      //.offset([50,0])
      .html(function (d) {   
          ////console.log(d)      
        var text = `
        <table class="tiptable" style="margin-left: 2.5px">
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Code:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.org + `</span></td></tr>
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Description:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.org_desc + `</span></td></tr>
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Start Date:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.start + `</span></td></tr>
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">End Date:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.end + `</span></td></tr>
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Treaty:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.treaty + `</span></td></tr>
        </table>`;
        
        return text;
      });
      
    svg.call(tip);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+margin.left+","+ (height - margin.top - margin.bottom) + ")")
      //.attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
              //.tickFormat(d3.timeFormat("%Y-%m-%d")))
              //.ticks([-2000,0,2000])
              //.tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")	
        //.style("text-anchor", "end")
        .style("text-anchor", "middle")
        .attr("fill","black")
        //.attr("dx", "-.8em")
        //.attr("dy", ".15em")
        //.attr("transform", "rotate(-65)");


axisBottom = d3.axisBottom(x)
    .tickPadding(2)
    .tickFormat(d3.timeFormat("%Y"))
    
//console.log(data)

gRects=svg.append("g")
.attr("class", "rects")
.attr("transform", "translate("+margin.left+",30)");
//.attr("transform", "translate("+margin.left+","+height+")");

var bar = gRects.selectAll("g")
    .data(data)
//console.log(bar)
bar=bar
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//console.log(width)
bar
    .append("rect")
    //.attr("id",function(d){return d.org})
    .attr("fill", "white")
    .attr('stroke',"grey")
    .attr("stroke-width","0.1")
    .attr("x", margin.left)
    .attr("y", d => y(d.org)-10)
    .attr("width", width-margin.left-margin.right-50)
    .attr("height", function(d,i) {
        /* if (i%2 == 0){
            return 20;
        }else if (i%3 == 0){
            return 10;
        }else{
            return 60
        } */
        return 40;
    })

/* xGrid = gRects.append("g")
.attr("transform", "translate("+margin.left+",-10)");

xGridLines = xGrid.selectAll("line")
.data(x.ticks());
//console.log(x.ticks())
//xGridLines.exit().remove();

xGridLines.enter().append("line")
    .attr("class", "enter") //"grid-line")
    //.merge(xGridLines)
    // .transition(vis.t)
    .attr("x1", d => x(d))
    .attr("y1", d => 0)
    .attr("x2", d => x(d))
    .attr("y2", d => height-margin.top-margin.bottom)
    .attr('stroke', "#e7e7e7")
    .style("stroke-dasharray", ("3, 3")) ;
 */
xGrid = svg.append("g")
.attr("transform", "translate("+margin.left+",-10)");

xGridLines = xGrid.selectAll("line")
.data(x.ticks());
//console.log(x.ticks())
//console.log(xGridLines)

xGridLines.enter().append("line")
    .attr("class", "gridLine") //"grid-line")
    .attr("x1", function(d){
        //console.log(d)
        ////console.log(d.getFullYear())
        ////console.log(parseTime(d.getFullYear().toString()+"-01-01"))
        return x(d);
    } )
    .attr("y1", d => 0)
    .attr("x2", function(d){
        //console.log(d)
        return x(d);
    } )
    .attr("y2", d => height-margin.top-margin.bottom)
    .attr('stroke', "#e7e7e7")
    .style("stroke-dasharray", ("3, 3")) ;

bar
.append("rect")
.attr("id",function(d){return d.org})
.attr("fill", function(d) { 
    return colorScale(d.org)})
.attr('stroke',"black")
.attr("stroke-width","0.1")
.attr("x", margin.left)
.attr("y", d => y(d.org))
.attr("width", 0)
.on('mouseover', function(d){
    tip.show(d,this);
    })
.on('mouseout', function(d){
    tip.hide(d,this);
    //mouseout()
    })
.transition()
.duration(750)
//.attr("width", d => vis.x(d.value))
.attr("x", function(d) { 
    ////console.log(d.start)
    ////console.log(parseTime(d.start))
    return x(parseTime(d.start)); })
.attr("width", function(d) { 
    //console.log(x(parseTime(d.end)) - x(parseTime(d.start)))
    return (x(parseTime(d.end)) - x(parseTime(d.start)))})
.attr("height", function(d) { 
    return 20})


bar
    .append("text")
    .text(d => d.org)
    .attr("x", function(d) { 
        return x(parseTime(d.start))+5; })
    .attr("y", d => y(d.org)+10)
    .attr("fill", "white")
    .style("text-anchor", "start")
    .style("dominant-baseline", "middle")
    .style("font-size", "10px")
    .on('mouseover', function(d){
        tip.show(d,this);
        })
    .on('mouseout', function(d){
        tip.hide(d,this);
        //mouseout()
        })


}
