ConfigRow = function (_option,_node) {
    this.option=_option
    //////////////console.log("entra en configRow")
    this.node=_node
    //this.init();
  };

ConfigRow.prototype.init = async function () {
    var cr=this

    cr.getValuesFromOption()
    //console.log(cr)
    cr.replaceParmtrsQuery("query")
    //////////////console.log(cr)
    cr.getNameClasses()
    //////////console.log("configRow.init")
    await cr.getResults()
    ////////////console.log(cr)
}
ConfigRow.prototype.initImport = async function () {
  var cr=this
  ////console.log("antes from option")
  cr.getValuesFromOption()
  //////////////console.log(cr)
  ////console.log("despues from option y antes parms")

  cr.replaceParmtrsQuery("query")
  ////console.log("despues parms")

  //////////////console.log(cr)
  //cr.getNameClasses()
  ////console.log("despues get name classes")
  //////////console.log("configRow.init")
  //await cr.getResults()
  ////////////console.log(cr)
}
ConfigRow.prototype.update = async function(option,node){
  var cr=this;
  ////////////console.log(option)
  cr.option=option
  cr.node=node
  await cr.init()
}
ConfigRow.prototype.fromOptionToConfigRow = async function(option){
  var cr=this;
  //////console.log(option)
  const rowInConfigFile=configFile.file.filter(c=>c.option==option.option)[0]
  //////////console.log(rowInConfigFile)


  Object.keys(rowInConfigFile).forEach(function(k){
    if(option[k]){
      cr[k]=option[k]
    }else{
      cr[k]=rowInConfigFile[k]
    }
  })
  
  cr["askquery"]=option["askquery"]
  cr["node"]=option["node"]
  cr["query"]=option["query"]
  cr["rowConfigFile"]=option["rowConfigFile"]

  cr.replaceParmtrsQuery("query")

  //console.log(cr.filters)
  cr.getNameClasses()
  await cr.getResults()
}
ConfigRow.prototype.setDefaultValues = function (){
  var cr=this;
  if(cr["filters"]=="None"){
    cr["filters"]=[]
  }
}
ConfigRow.prototype.filterByValueField = function (value,field) {
    var cr=this;
    return cf.file.filter(d=>d[field]==value)
  }



/* ConfigRow.prototype.replaceParmtrsQuery = function(queryName){
    var cr=this;
    if(cr.node!=undefined){
        if((cr.rowFields.parameters!="")&&(cr.rowFields.parameters!=null)){
            //////////////////console.log(cr.rowFields.parameters)
            //////////////////console.log(cr.node)
            //////////////////console.log(cr.rowFields.askquery)
            for (let i = 0; i < cr.rowFields.parameters.length; ++i) { 
                cr.rowFields[queryName]=cr.rowFields[queryName].replaceAll("PARAMETER"+(i+2).toString(), cr.node[cr.rowFields.parameters[i]["property"]]);
                //////////////////console.log(cr.rowFields.parameters[i])
                //////////////////console.log(cr.node[cr.rowFields.parameters[i]["property"]])
            } 
            //////////////////console.log(cr.rowFields.askquery) 
        }
        cr.rowFields[queryName]=cr.rowFields[queryName].replaceAll("PARAMETER", cr.node[cr.node["class"]+"_uri"]);    
    }
  } */
/* ConfigRow.prototype.fromSelectToAskQuery = function(){
  var cr=this;
  if(!cr.rowFields["askquery"]){
    cr.rowFields.askquery=fromSelectToAskQuery(cr.rowFields.query)
  }
  //////////////////console.log(cr.rowFields.askquery)
  cr.replaceParmtrsQuery("askquery")
} */


ConfigRow.prototype.fromSelectToAskQuery = function(){
  var cr=this;
  if(cr["askquery"]==null){
    cr["askquery"]=fromSelectToAskQuery(cr["query"])
  }
  //////////////////console.log(cr.rowFields.askquery)
  cr.replaceParmtrsQuery("askquery")
}

ConfigRow.prototype.getClassesCorrespondence=function(){
  var cr=this,tmp={}
  cr["classes_text"].forEach(function(c){
    tmp[c["class"]]=c["text"]
  })
  return tmp
}
ConfigRow.prototype.getResults = async function () {
  var cr=this;
  ////console.log(cr)
  cr.results = await runSparlqQuery(cr.endpoint_url,cr.query,"query");
  ////console.log(cr.results)
}

function ConfigRowBasic(...args){
  ConfigRow.apply(this, args);
  }
  
ConfigRowBasic.prototype = Object.create(ConfigRow.prototype);

ConfigRowBasic.prototype.replaceParmtrsQuery = function(queryName){
  var cr=this;
  ////////console.log("replace parms query")
  /* var on=this;
  if(on.node!=undefined){
      if((on.parameters!="")&&(on.parameters!=null)){
          //////////////////console.log(cr.rowFields.parameters)
          //////////////////console.log(cr.node)
          //////////////////console.log(cr.rowFields.askquery)
          for (let i = 0; i < on.parameters.length; ++i) { 
              on[queryName]=on[queryName].replaceAll("PARAMETER"+(i+2).toString(), on.node[on.parameters[i]["property"]]);
              //////////////////console.log(cr.rowFields.parameters[i])
              //////////////////console.log(cr.node[cr.rowFields.parameters[i]["property"]])
          } 
          //////////////////console.log(cr.rowFields.askquery) 
      }
      on[queryName]=on[queryName].replaceAll("PARAMETER", on.node[on.node["class"]+"_uri"]);    
  } */
  //////console.log(cr.node)
  if(cr.node!=undefined) cr[queryName]=replaceParmtrsQuery(cr[queryName],cr.parameters,cr.node)
  //////////console.log(cr[queryName])
}

ConfigRowBasic.prototype.getNameClasses = function () {
  var cr=this;
  ////////////console.log(cr.rowFields)
  //console.log(cr)
  cr.nameClasses=cr.classes_text.map(d=>d.text)
  //////console.log(cr.nameClasses)
}

ConfigRowBasic.prototype.getValuesFromOption = async function () {
  var cr=this,rowFields;
  cr.rowNumber=configFile.getRowNumber(cr.option)
  //////////////////console.log(cf.file[cr.rowNumber])
  //////////////console.log(cr.node)
  
  rowFields=configFile.getFieldsConfigFile(cr.rowNumber)
  Object.keys(rowFields).forEach(function(k){
    cr[k]=rowFields[k]
  })

  cr.fromSelectToAskQuery()
  cr.setDefaultValues()
}

function ConfigRowExpert(...args){
  ConfigRow.apply(this, args);
  }
  
ConfigRowExpert.prototype = Object.create(ConfigRow.prototype);

ConfigRowExpert.prototype.getValuesFromOption = async function () {
  var cr=this;
  //////console.log(cr.option)
  let option=JSON.parse(JSON.stringify(cr.option));
  Object.keys(option).forEach(function(k){
    cr[k]=option[k]
  })
}
ConfigRowExpert.prototype.getNameClasses = function () {
  var cr=this;
  ////////////console.log(cr.rowFields)
  cr.nameClasses=["uri","bnode","literal","menu option","link basic graph","typed-literal"]
  //////console.log(cr.nameClasses)
}
ConfigRowExpert.prototype.replaceParmtrsQuery = function(queryName){
  var cr=this;
  ////console.log(cr.node)
  cr.query=cr.query.replace("position",cr.position).replace("PARAMETER",cr.node.uri)
}