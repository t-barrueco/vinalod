ConfigRow = function (_option,_node) {
    this.option=_option
    this.node=_node
    //console.log(this.node)
    this.init();
  };

ConfigRow.prototype.init = function () {
    var cr=this;
    //console.log(cr.option)
    if((cr.node==undefined)&&(cr.option["subject-object"])){
      //console.log("expert")
      buildExpertQuery()
      //cr.endpoint_url=cr.option["url"]
    }else{
      cr.rowNumber=configFile.getRowNumber(cr.option)
      cr.rowFields=configFile.getFieldsConfigFile(cr.rowNumber)
      //let line=configFile.getFieldsConfigFile(cr.rowNumber)
      ////console.log(line)
      //Object.assign(cr, line);
/*       cr=Object.assign(cr, configFile.getFieldsConfigFile(cr.rowNumber));
      obj = {...obj, ...configFile.getFieldsConfigFile(cr.rowNumber)}; */
      //console.log(cr)
      cr.replaceParmtrsQuery("query")
      cr.getNameClasses()
    }
    console.log("fin init CR")
    function buildExpertQuery(){
      var sparqlQuery;
      if (node["subject-object"] == "s") {
          sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + node["uri"]+ ">).}"
      } else {
          sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + node["uri"] + ">).}"
      }
      cr.query=sparqlQuery
      //return sparqlQuery
    }
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

  if(cr.option["subject-object"]){
    cr.askquery=fromSelectToAskQuery(cr.query)
  }else{
    if(!cr.rowFields["askquery"]){
      cr.rowFields.askquery=fromSelectToAskQuery(cr.rowFields.query)
    }
    cr.replaceParmtrsQuery("askquery")
  } 
  /* if(!cr.rowFields["askquery"]){
    fromSelectToAskQuery()
  } */
 
  function fromSelectToAskQuery(query){
    var mySubString;
    
    //////////console.log(cr)
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
    return query
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