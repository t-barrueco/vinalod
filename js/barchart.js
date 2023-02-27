// set the dimensions and margins of the graph
function createBarchart(data,title){

modalVisibilityOn()

const modalHeader=getModalHeader()
const modalContent=getModalContent()
modalHeader.innerHTML = title

var div=document.createElement("div")
div.setAttribute("id","modalGraph")
div.setAttribute("style","overflow: auto")
modalContent.appendChild(div)
let titleColor="white"
let titleAltColor="black"

var margin = {top: 20, right: 0, bottom: 0, left: 20},
width = modalContent.offsetWidth - margin.left - margin.right,
height = modalContent.offsetHeight - margin.top - margin.bottom;
height =data.length * 40
        
// append the svg object to the body of the page
var svg=d3.select("#modalGraph").append("svg")
.attr("width", width)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(250,10)")

// Parse the Data
  var x = d3.scaleLinear()
    .domain([0, d3.max(data.map(d=>+d.Number))])
    .range([ 0, width-260]);

  svg.append("g")
    .attr("transform", "translate(0,10)")
    .call(d3.axisTop(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 10, height ])
    .domain(data.map(function(d) { return d.Category; }))
    .padding(.1);

  svg.append("g")
    .call(d3.axisLeft(y))

  svg.selectAll(".myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Category); })
    .attr("width", function(d) { return x(d.Number); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2")

  svg.selectAll(".myText")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function(d) { return x(d.Number); })
    .attr("y", function(d) { return y(d.Category) + (y.bandwidth()/2); })
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .attr("fill", titleColor)
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .text(function(d) { return d.Number; })
    .call(
        function (text){
            text.filter(function(t){
                return x(t.Number)<20
            })
            .attr("dx", +4)
        .attr("fill", titleAltColor)
        .attr("text-anchor", "start")

        }
        );
}
