ConfigRow = function (_option,_node) {
    this.option=_option
    this.node=_node
    this.init();
  };

ConfigRow.prototype.init = function () {
    var cr=this;
    cr.rowNumber=configFile.getRowNumber(cr.option)
    cr.rowFields=configFile.getFieldsConfigFile(cr.rowNumber)
    configRowsList.push(cr)
    cr.replaceParmtrsQuery()
  }

ConfigRow.prototype.filterByValueField = function (value,field) {
    var cr=this;
    return cf.file.filter(d=>d[field]==value)
  }

ConfigRow.prototype.replaceParmtrsQuery = function(){
    var cr=this;
    console.log(cr)
    cr.rowFields.paramQuery=cr.rowFields.query
    if(cr.node!=undefined){
        if((cr.rowFields.parameters!="")&&(cr.rowFields.parameters!=null)){
            for (let i = 0; i < cr.rowFields.parameters.length; ++i) { 
                cr.rowFields.paramQuery=cr.rowFields.paramQuery.replaceAll("PARAMETER"+(i+2).toString(), cr.node[cr.rowFields.parameters[i]]);
            }  
        }
        //The value for the PARAMETER in the Sparql query is the "[class]_uri" or the
        //name of the class with no "_uri"   
        cr.rowFields.paramQuery=cr.rowFields.paramQuery.replaceAll("PARAMETER", cr.node[cr.node["class"]+"_uri"]);    
    }
  }
