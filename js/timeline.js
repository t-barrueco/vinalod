function timelineGraph(data,modalHeader,modalContent){
    var endDate,treaty;
    var formatTime=d3.timeFormat("%m-%d-%Y")
    var margin = {top: 30, right: 30, bottom: 30, left: 30}
    modalHeader.innerHTML = "Timeline EU Members"

    var xFormat = "%Y-%m-%d";;
    var parseTime = d3.timeParse("%Y-%m-%d");

    data = data.map(d=>{
        treaty=""
        if(d.endDate){
            endDate=d.endDate.value
        }
        if(d.treaty){
            treaty=d.treaty.value
        }
        return {
          org: d.org.value,
          org_desc: d.org_desc.value,
          start: d.startDate.value,
          end: endDate,
          treaty:treaty
        }
        }).sort((a,b)=>  b.star-a.start);

    let width=1100
    let height=500

    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    modalContent.appendChild(div)

    let svg=d3.select("#modalGraph").append("svg")
    .style("width", width - margin.left + 'px')
    .style("height", height + 'px');

    let y= d3.scaleBand()
    .domain(data.map(d => d.org))
    .range([0,height - margin.bottom - margin.top-200])
    let x=d3.scaleTime()
      .domain([d3.min(data, d => parseTime(d.start)), d3.max(data, d => parseTime(d.end))])
      .range([margin.left,width - margin.left-margin.right-20])

    var colorScale = d3.scaleOrdinal().domain(y.domain())
      .range(d3.schemeCategory10);

    var tip = d3.tip()
      .attr('class', 'd3-tip z-50')
      .html(function (d) {   

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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")	
        .style("text-anchor", "middle")
        .attr("fill","black")

    
let gRects=svg.append("g")
.attr("class", "rects")
.attr("transform", "translate("+margin.left+",30)");

var bar = gRects.selectAll("g")
    .data(data)

bar=bar
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

bar
    .append("rect")
    .attr("fill", "white")
    .attr('stroke',"grey")
    .attr("stroke-width","0.1")
    .attr("x", margin.left)
    .attr("y", d => y(d.org)-10)
    .attr("width", width-margin.left-margin.right-50)
    .attr("height", function(d,i) {
        return 40;
    })

let xGrid = svg.append("g")
.attr("transform", "translate("+margin.left+",-10)");

let xGridLines = xGrid.selectAll("line")
.data(x.ticks());

xGridLines.enter().append("line")
    .attr("class", "gridLine") //"grid-line")
    .attr("x1", function(d){
        return x(d);
    } )
    .attr("y1", d => 0)
    .attr("x2", function(d){
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
    })
.transition()
.duration(750)
.attr("x", function(d) { 
    return x(parseTime(d.start)); })
.attr("width", function(d) { 
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
        })
}
