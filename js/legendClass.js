//Legend = function ( _classFilterName, _property, _filterType,_parent,_bubbleId) {
Legend = function ( _parent) {
    //this.property = _property;
    //this.filterType = _filterType;
    //this.classFilterName = _classFilterName
    this.parent=_parent
    //this.bubbleId=_bubbleId
    this.init();
  };
  
  /////////////////// initVis Method //////////////////////
  
Legend.prototype.init = function () {
  var le=this;
  //fi.getValuesFilterVisibleNodes()
  //fi.addHtml()
  //fi.checkVisibility()
  //////console.log(le.parent)
  le.parentEl=d3.select("#"+le.parent)
  //////console.log(le.parentEl)
  /* for (var i = 0; i < colorScale.domain().length; i++) {
    le.addOne(i,colorScale.domain()[i])
  } */ 
  le.initColors(i=0)
}
Legend.prototype.initColors=function(i){
    var le=this;
    //////console.log(i)
    for (i; i < colorScale.domain().length; i++) {
        //console.log(colorScale.domain())
        //console.log(colorScale.domain()[i])
        le.addOne(i,colorScale.domain()[i])
      } 
    //////console.log(colorScale)
    //le.colorScale=colorScale
    
}
Legend.prototype.addColors=function(){
    var le=this;
    //////console.log(newColorScale.domain())
    //////console.log(le.colorScale.domain())
    //////console.log(newColorScale.domain().length)
    //////console.log(d3.selectAll("#legend .legend-color").size())
    if(colorScale.domain().length>d3.selectAll("#legend .legend-color").size()){
        le.initColors(i=(d3.selectAll("#legend .legend-color").size()))
    }
    /* for (var i = 0; i < colorScale.domain().length; i++) {
        le.addOne(i,colorScale.domain()[i])
      } */ 
    //le.colorScale=colo
}
/*   function fillLegend(dif,addOne){
    if ((addOne)&(dif.length>0)){
      appendLi(colorScale.domain().length-1,dif[0])
    }else if(!addOne){
      for (var i = 0; i < colorScale.domain().length; i++) {
        appendLi(i,colorScale.domain()[i])
      } 
    }
  
  } */
/*   function appendLi(i,textLi){
    var li,classLi;
    //////////////////console.log(colorScale.range())
    //////////////////////////////////console.log("pasa por appendLi")
    classLi="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white rounded-l-md "
    li=d3.select("#legend").append("li")
    .attr("class", "flex col-span-1 rounded-md shadow-sm")
    li.append("div")
    .attr("class", classLi+"bg-"+colorCorrespondence[colorScale.range()[i]])
    li.append("div")
    .attr("class","flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md")
    .append("div")
    .attr("class","flex-1 px-4 py-2 text-sm truncate")
    .append("a")
    .attr("class","font-medium text-gray-900 hover:text-gray-600")
    .append("text")
    .text(textLi);
  }
  function differenceArrays(a1, a2) {
    var result = [];
    ////////////////////////////////console.log(a1)
    ////////////////////////////////console.log(a2)
    for (var i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) === -1) {
        result.push(a1[i]);
      }
    }
    return result;
  } */
Legend.prototype.addOne=function (index,textLi){
  var le=this;
  var li,classLi;
  
  classLi="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white rounded-l-md legend-color "
  li=le.parentEl.append("li")
  .attr("class", "flex col-span-1 rounded-md shadow-sm")
  //console.log(nodesClassesCorrespondence)
  //console.log(colorCorrespondence)
  //console.log(colorScale.range()[index])
  //console.log(colorCorrespondence[colorScale.range()[index]])
  li.append("div")
  .attr("class", classLi+"bg-"+colorCorrespondence[colorScale.range()[index]])
  .append("img")
  .attr("src",getImage(textLi))
  .attr("width","30px")
  .attr("height","30px")

  
  //<img src="images/check.svg" width="40px" height="40px">
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
    ////console.log(icon)
    //console.log(filesIcons)
    if(icon.length==0){
      return "images/empty.svg"
    }else{
      return icon[0]["FILE"]
    }
  }
}