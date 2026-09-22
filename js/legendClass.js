Legend = function ( _parent,_graph) {
    this.parent=_parent
    this.graph=_graph
    this.init();
  };
  
  
Legend.prototype.init = function () {
  let le=this;
  le.parentEl=d3.select("#"+le.parent)
  le.elements=[]
  le.initColors()
}
Legend.prototype.initColors=function(){
    let le=this;
    for (let i=0; i < le.graph.colorScale.domain().length; i++) {
      if(!le.elements.includes(le.graph.colorScale.domain()[i])){
        le.addOne(i,le.graph.colorScale.domain()[i])
      }
      } 
}
Legend.prototype.addColors=function(){
    let le=this;
    if(le.graph.colorScale.domain().length>d3.selectAll("#legend .legend-color").size()){
        le.initColors(i=(d3.selectAll("#legend .legend-color").size()))
    }
}

Legend.prototype.addOne=function (index,textLi){
  let le=this;
  var li,classLi;
  classLi="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white legend-color "
  li=le.parentEl.append("li")
  .attr("class", "flex col-span-1 rounded-md shadow-sm")
  li.append("div")
  .attr("class", classLi+"bg-"+le.graph.colorCorrespondence[le.graph.colorScale.range()[index]]+ " border-black")
  .append("img")
  .attr("src",getImage(textLi))
  .attr("width","30px")
  .attr("height","30px")

  
  li.append("div")
  .attr("class","flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-black")

  .append("div")
  .attr("class","flex-1 px-4 py-2 text-sm truncate")
  .append("a")
  .attr("class","font-medium text-gray-900 hover:text-gray-600")
  .append("text")
  .text(textLi);
  le.elements.push(textLi)
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