ConfigRow = function (_option,_node) {
    this.option=_option
    this.node=_node
    this.init();
  };

ConfigRow.prototype.init = function () {
    var cr=this;
    cr.rowNumber=configFile.getRowNumber(cr.option)
    cr.rowFields=configFile.getFieldsConfigFile(cr.rowNumber)
    cr.replaceParmtrsQuery("query")
    cr.getNameClasses()
  }
ConfigRow.prototype.update = function(option,node){
  var cr=this;
  cr.option=option
  cr.node=node
  cr.init()
}
ConfigRow.prototype.filterByValueField = function (value,field) {
    var cr=this;
    return cf.file.filter(d=>d[field]==value)
  }

ConfigRow.prototype.replaceParmtrsQuery = function(queryName){
    var cr=this;
    if(cr.node!=undefined){
        if((cr.rowFields.parameters!="")&&(cr.rowFields.parameters!=null)){
            for (let i = 0; i < cr.rowFields.parameters.length; ++i) { 
                cr.rowFields[queryName]=cr.rowFields[queryName].replaceAll("PARAMETER"+(i+2).toString(), cr.node[cr.rowFields.parameters[i]]);
            }  
        }
        cr.rowFields[queryName]=cr.rowFields[queryName].replaceAll("PARAMETER", cr.node[cr.node["class"]+"_uri"]);    
    }
  }
ConfigRow.prototype.fromSelectToAskQuery = function(){
  //first we transform the select to ask query
  var cr=this;
  if(!cr.rowFields["askquery"]){
    fromSelectToAskQuery()
  }
  cr.replaceParmtrsQuery("askquery")
  function fromSelectToAskQuery(){
    var mySubString,query;
    query=cr.rowFields.query
    ////////console.log(cr)
    if(query.toLowerCase().indexOf("where")!=-1){
      mySubString = query.substring(
        query.toLowerCase().indexOf("select"), 
        query.toLowerCase().indexOf("where") - 1 
      );
      query=query.replace(mySubString,"ASK")
      if(query.toLowerCase().indexOf("select")!=-1){
        mySubString = query.substring(
          query.toLowerCase().indexOf("select"), 
          query.toLowerCase().lastIndexOf("where") + 5 
        );
        query=query.replace(mySubString,"")
      }
    }else{
      mySubString = query.substring(
        query.toLowerCase().indexOf("select"), 
        query.toLowerCase().indexOf("{") - 1 
      );
      query=query.replace(mySubString,"ASK")
    }
    
    if(query.toLowerCase().lastIndexOf("group by")!=-1){
      mySubString = query.substring(
        query.toLowerCase().lastIndexOf("group by"), 
        query.length - 1 
      );
      query=query.replace(mySubString,"")
    }
  
    if(query.toLowerCase().lastIndexOf("order by")!=-1){
      mySubString = query.substring(
        query.toLowerCase().lastIndexOf("order by"), 
        query.length 
      );
      query=query.replace(mySubString,"")
    }
  
    if(query.toLowerCase().lastIndexOf("limit")!=-1){
      mySubString = query.substring(
        query.toLowerCase().lastIndexOf("limit"), 
        query.length 
      );
      query=query.replace(mySubString,"")
    }
    query=query.replaceAll("parameter","PARAMETER")
    cr.rowFields.askquery=query
  }
}
ConfigRow.prototype.getNameClasses = function () {
  var cr=this;
  /* cr.rowFields.classes_text.forEach(function(classText){

  }) */
  cr.nameClasses=cr.rowFields.classes_text.map(d=>d.text)
}
ConfigRow.prototype.getClassesCorrespondence=function(){
  var cr=this,tmp={}
  cr.rowFields["classes_text"].forEach(function(c){
    tmp[c["class"]]=c["text"]
  })
  return tmp
}