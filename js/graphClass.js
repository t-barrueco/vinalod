graph = function ( _classFilterName, _property, _filterType,_parent) {
    this.property = _property;
    this.filterType = _filterType;
    this.classFilterName = _classFilterName
    this.parent=_parent
    this.init();
  };
  
  /////////////////// initVis Method //////////////////////
  
graph.prototype.init = function () {
  var fi=this;
  //fi.values=getValuesFilterVisibleNodes()
  ////////////////////console.log("pasa por aquí")
  fi.getValuesFilterVisibleNodes()
  fi.addHtml()
  //fi.checkVisibility()
  }

graph.prototype.getValuesFilterVisibleNodes=function (){
  var fi=this,values=[]
  // get all values from property in data
  //////////////////////console.log("pasa por aquí también")
  networkGraph.data["nodes"].forEach(function(d){
    //getKeyByValue(nodesClassesCorrespondence,classFilter) gets class name from code, having class name showed to the user
    
    if(d["class"]==fi.classFilterName){
      //////////////////////console.log(d)
      values.push(d[fi.property])
    }
  })
  values=[...new Set(values)].sort()
  fi.values=values
  ////////////////////console.log(fi.values.length)
  ////////////////////console.log(fi.filterType)

  /// VER SI TIENE EL INCLUIDO ALL PARA ASIGNARLO A FI.ALL
  if ((fi.values.length>1)&(fi.filterType=="dropdown")){
    fi.values=["All"].concat(fi.values)
  }
}