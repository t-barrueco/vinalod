// set the dimensions and margins of the graph
function createBarchart(data,title){

console.log(data)

modalVisibilityOn()

const modalHeader=getModalHeader()
const modalContent=getModalContent()
modalHeader.innerHTML = title

var div=document.createElement("div")
div.setAttribute("id","modalGraph")
div.setAttribute("style","overflow: auto")
modalContent.appendChild(div)
console.log(modalContent)
let titleColor="white"
let titleAltColor="black"

var margin = {top: 20, right: 0, bottom: 0, left: 20},
width = modalContent.offsetWidth - margin.left - margin.right,
height = modalContent.offsetHeight - margin.top - margin.bottom;
height =data.length * 40
//console.log(document.getElementById("modalGraph"))
        
// append the svg object to the body of the page
var svg=d3.select("#modalGraph").append("svg")
//.attr("width", width + margin.right + margin.left)
//.attr("height", height + margin.top + margin.bottom)
.attr("width", width)
.attr("height", height + margin.top + margin.bottom)
.append("g")
//.attr("transform", "translate(" + [width + margin.right + margin.left >> 1, height + margin.top + margin.bottom >> 1] + ")")
.attr("transform", "translate(250,10)")

// Parse the Data
  // Add X axis
  console.log(data)

  console.log(d3.max(data.map(d=>+d.Number)))
  var x = d3.scaleLinear()
    .domain([0, d3.max(data.map(d=>+d.Number))])
    .range([ 0, width-260]);

  svg.append("g")
    //.attr("transform", "translate(0," + margin.top + ")")
    .attr("transform", "translate(0,10)")
    .call(d3.axisTop(x))
    .selectAll("text")
      //.attr("transform", "translate(-10,0)rotate(-45)")
      .attr("transform", "translate(-10,0)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 10, height ])
    .domain(data.map(function(d) { return d.Category; }))
    .padding(.1);

    //const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);


  svg.append("g")
    .call(d3.axisLeft(y))

    console.log(y.bandwidth())
  //Bars
  svg.selectAll(".myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Category); })
    .attr("width", function(d) { return x(d.Number); })
    .attr("height", y.bandwidth() )
    //.attr("height", 10)
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
            console.log(text)
            text.filter(function(t){
                console.log(t)
                return x(t.Number)<20
            })
            .attr("dx", +4)
        .attr("fill", titleAltColor)
        .attr("text-anchor", "start")

        }
/*         text => text.filter(i => xScale(X[i]) - xScale(0) < 20) // short bars
        .attr("dx", +4)
        .attr("fill", titleAltColor)
        .attr("text-anchor", "start") */
        );


    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")
/*     var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Category; }))
    .padding(.1);

    var x = d3.scaleLinear()
    .domain([0, d3.max(data.map(d=>+d.Number))])
    .range([ 0, width]);

    let color="#69b3a2"
    var margin = {top: 20, right: 0, bottom: 0, left: 20},
    width = modalContent.offsetWidth - margin.left - margin.right,
    height =data.length * 40

    const svg = d3.select("#modalGraph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", x(0))
      .attr("y", function(d) { return y(d.Category); })
      //function(d) { return x(d.Number);
      //.attr("width", i => xScale(X[i]) - x(0))
      .attr("width", function(d) { return x(d.Number); })
      .attr("height", y.bandwidth());

    svg.append("g")
        .attr("fill", titleColor)
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", function(d) { return x(d.Number)-10; })
        .attr("y",function(d) { return y(d.Category)/2; })
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .text(function(d) { return y(d.Category); })
        //.call(text => text.filter(i => xScale(X[i]) - xScale(0) < 20) // short bars
        //    .attr("dx", +4)
        //    .attr("fill", titleAltColor)
        //    .attr("text-anchor", "start")); */
}
