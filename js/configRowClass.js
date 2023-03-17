ConfigRow = function (_option,_node) {
    this.option=_option
    this.node=_node
  };

ConfigRow.prototype.init = async function () {
    var cr=this
    cr.getValuesFromOption()
    cr.replaceParmtrsQuery("query")
    cr.getNameClasses()
    await cr.getResults()
}
ConfigRow.prototype.import=function(configRowObject){
  var cr=this
  Object.keys(configRowObject).forEach(function(k){
    cr[k]=configRowObject[k]
  })
}

ConfigRow.prototype.update = async function(option,node){
  var cr=this;
  cr.option=option
  cr.node=node
  await cr.init()
}

ConfigRow.prototype.setDefaultValues = function (){
  var cr=this;
  if(cr["filters"]=="None"){
    cr["filters"]=[]
  }
}
ConfigRow.prototype.fromSelectToAskQuery = function(){
  var cr=this;
  if(cr["askquery"]==null){
    cr["askquery"]=fromSelectToAskQuery(cr["query"])
  }
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
  cr.results = await runSparlqQuery(cr.endpoint_url,cr.query,"query");
}

function ConfigRowBasic(...args){
  ConfigRow.apply(this, args);
  }
  
ConfigRowBasic.prototype = Object.create(ConfigRow.prototype);

ConfigRowBasic.prototype.getValuesFromConfig=function(option){
  return configFile.file.filter(c=>c.option==option.option)[0]
}

ConfigRowBasic.prototype.fromOptionToConfigRow = async function(option){
  var cr=this;

  values=cr.getValuesFromConfig(option)

  Object.keys(values).forEach(function(k){
    if(option[k]){
      cr[k]=option[k]
    }else{
      cr[k]=values[k]
    }
  })
  
  cr["askquery"]=option["askquery"]
  cr["node"]=option["node"]
  cr["query"]=option["query"]
  cr["rowConfigFile"]=option["rowConfigFile"]

  cr.replaceParmtrsQuery("query")

  cr.getNameClasses()
  await cr.getResults()
}

ConfigRowBasic.prototype.replaceParmtrsQuery = function(queryName){
  var cr=this;
  if(cr.node!=undefined) cr[queryName]=replaceParmtrsQuery(cr[queryName],cr.parameters,cr.node)
}

ConfigRowBasic.prototype.getNameClasses = function () {
  var cr=this;
  cr.nameClasses=cr.classes_text.map(d=>d.text)
}

ConfigRowBasic.prototype.getValuesFromOption = async function () {
  var cr=this,rowFields;
  cr.rowNumber=configFile.getRowNumber(cr.option)
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

ConfigRowExpert.prototype.getValuesFromConfig = async function (option) {
  var cr=this;
  option=JSON.parse(JSON.stringify(option));
  Object.keys(option).forEach(function(k){
    cr[k]=option[k]
  })
}

ConfigRowExpert.prototype.fromOptionToConfigRow = async function(option){
  var cr=this;

  Object.keys(option).forEach(function(k){
    cr[k]=option[k]
  })
  cr["node"]=node
  cr.replaceParmtrsQuery("query")

  cr.getNameClasses()
  await cr.getResults()
}

ConfigRowExpert.prototype.getValuesFromOption = async function () {
  var cr=this;
  let option=JSON.parse(JSON.stringify(cr.option));
  Object.keys(option).forEach(function(k){
    cr[k]=option[k]
  })
}
ConfigRowExpert.prototype.getNameClasses = function () {
  var cr=this;
  cr.nameClasses=["uri","bnode","literal","menu option","link basic graph","typed-literal"]
}
ConfigRowExpert.prototype.replaceParmtrsQuery = function(queryName){
  var cr=this;
  cr.query=cr.query.replace("position",cr.position).replace("PARAMETER",cr.node.uri)
}