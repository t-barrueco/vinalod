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
  var cr=this;
  if(!cr.rowFields["askquery"]){
    cr.rowFields.askquery=fromSelectToAskQuery(cr.rowFields.query)
  }
  cr.replaceParmtrsQuery("askquery")
}
ConfigRow.prototype.getNameClasses = function () {
  var cr=this;
  cr.nameClasses=cr.rowFields.classes_text.map(d=>d.text)
}
ConfigRow.prototype.getClassesCorrespondence=function(){
  var cr=this,tmp={}
  cr.rowFields["classes_text"].forEach(function(c){
    tmp[c["class"]]=c["text"]
  })
  return tmp
}