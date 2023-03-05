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
  //console.log(cr["classes_text"])
  cr["classes_text"].forEach(function(c){
    tmp[c["class"]]=c["text"]
  })
  return tmp
}

//nodesClassesCorrespondence={uri:"uri",bnode:"bnode",literal:"literal","menuOption":"menu option",link_basic_graph:"link basic graph","typed-literal":"typed-literal","more_results":"Results collapsed"}
ConfigRow.prototype.getResults = async function () {
  var cr=this;
  cr.results = await runSparlqQuery(cr.endpoint_url,cr.query,"query");
  //console.log(cr.results)
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

ConfigRowBasic.prototype.clusterResults = function (){
  var cr=this,number,unique,numberResults={};

  var maxNumber=$("#cluster-number").val()

  if(cr.hierarchy.length==1){
    numberResults[cr.results[0][cr.hierarchy[0].parent].value]=cr.results.length
  }else{
    cr.hierarchy.forEach(function(h,i){
      unique = [...new Set(cr.results.map(item => item[h.parent].value))];
      unique.forEach(function(u){
        number = cr.results.reduce(function (n, r) {
          return n + (r[h.parent].value == u);
        }, 0);
        numberResults[u]=number
      })
      if(cr.hierarchy[i-1]){
        numberResults[cr.results[0][cr.hierarchy[i-1]["parent"]].value]=unique.length
      }
    })
  }
  if(cr.results.length>maxNumber){
  }
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
    if(k=="hierarchy"){
      ////////////////console.log(rowFields[k])
    }
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
  //console.log(node)
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
  //console.log(cr.node.uri)
  cr.query=cr.query.replace("position",cr.position).replace("PARAMETER",cr.node.uri)
  //console.log(cr.query)
}

ConfigRowExpert.prototype.clusterResults = function (){
  /* var ocurrences = [], small, big, results_small, results_big, num_occ, results_big_filtered;
  if(settings["subject-object"]){
    var properties = results.map(function (r) {
      return r["p"]["value"]
    })
    var subjectObject=settings["subject-object"]
    var unique_properties = [...new Set(properties)]
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    unique_properties.forEach(function (d) {
      ocurrences.push({ "value": d, "ocurrences": countOccurrences(properties, d) })
    })
    small = ocurrences.filter(d => d.ocurrences <= 20).map(d => d.value)
    big = ocurrences.filter(d => d.ocurrences > 20).map(d => d.value)
    results_small = results.filter(r => small.includes(r["p"]["value"]))
    results_big = results.filter(r => big.includes(r["p"]["value"]))
    big.forEach(function (b) {
      results_big_filtered = results_big.filter(r => r["p"]["value"] == b)
      num_occ = ocurrences.filter(o => o.value == results_big[0]["p"]["value"])[0]["ocurrences"]
      if (subjectObject == "s") {
        results_small.push({ "o": { "type": results_big_filtered[0]["o"]["type"], "value": num_occ + " results", "more_results": results_big_filtered }, "p": results_big_filtered[0]["p"], "s": results_big_filtered[0]["s"], "class": "Cluster" })
      } else {
        results_small.push({ "s": { "type": results_big_filtered[0]["s"]["type"], "value": num_occ + " results", "more_results": results_big_filtered }, "p": results_big_filtered[0]["p"], "o": results_big_filtered[0]["o"], "class": "Cluster" })
      }
    })
    return results_small;
  }else{
    return results;
  }   */
}