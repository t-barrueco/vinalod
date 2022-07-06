Legend = function ( _parent) {
    this.parent=_parent
    this.init();
  };
  
  
Legend.prototype.init = function () {
  var le=this;
  le.parentEl=d3.select("#"+le.parent)
  le.initColors(i=0)
}
Legend.prototype.initColors=function(i){
    var le=this;
    for (i; i < networkGraph.colorScale.domain().length; i++) {
        ////console.log(networkGraph.colorScale.domain()[i])
        le.addOne(i,networkGraph.colorScale.domain()[i])
      } 
}
Legend.prototype.addColors=function(){
    var le=this;
    ////console.log("add colors")
    ////console.log(networkGraph.colorScale.domain())
    if(networkGraph.colorScale.domain().length>d3.selectAll("#legend .legend-color").size()){
        le.initColors(i=(d3.selectAll("#legend .legend-color").size()))
    }
}

Legend.prototype.deleteAllColors=function(){
  var le=this;
  d3.selectAll("#legend li").remove()
}
Legend.prototype.addOne=function (index,textLi){
  var le=this;
  var li,classLi;
  ////console.log(networkGraph.colorCorrespondence)
  ////console.log(networkGraph.colorScale.range())
  classLi="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white rounded-l-md legend-color "
  li=le.parentEl.append("li")
  .attr("class", "flex col-span-1 rounded-md shadow-sm")
  li.append("div")
  .attr("class", classLi+"bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale.range()[index]])
  .append("img")
  .attr("src",getImage(textLi))
  .attr("width","30px")
  .attr("height","30px")

  
  li.append("div")
  .attr("class","flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md")
  .append("div")
  .attr("class","flex-1 px-4 py-2 text-sm truncate")
  .append("a")
  .attr("class","font-medium text-gray-900 hover:text-gray-600")
  .append("text")
  .text(textLi);
  function getImage(textLi){
    icon=filesIcons.filter(function(d){
      return d.ID==textLi;
    })
    if(icon.length==0){
      return "images/empty.svg"
    }else{
      return icon[0]["FILE"]
    }
  }
}