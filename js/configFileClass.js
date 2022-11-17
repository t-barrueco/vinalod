ConfigFile = function (_file) {
    this.file=_file
    this.init();
  };

/* ConfigFile.prototype.init = function () {
    var cf=this;
  } */

function ConfigFileBasic(...args){
  ConfigFile.apply(this, args);
  }
    
ConfigFileBasic.prototype = Object.create(ConfigFile.prototype);

ConfigFileBasic.prototype.init = function () {
  var cf=this;

}

ConfigFileBasic.prototype.filterByValueField = function (value,field) {
    var cf=this;
    return cf.file.filter(d=>d[field]==value)
  }

ConfigFileBasic.prototype.getRowNumber = function (option) {
    var cf=this;

    return cf.file.map(function (e) {
        return e.option;
      }).indexOf(option)
  }

ConfigFileBasic.prototype.getFieldsConfigFile= function(rowDataConfig){
    var cf=this;
    ////console.log(cf.file[rowDataConfig])
    return JSON.parse(JSON.stringify(cf.file[rowDataConfig]));
  }

ConfigFileBasic.prototype.getRowsNodeClass= function(classNode){
    var cf=this;

    return cf.file.filter(d=>d.class==classNode)
  }

ConfigFileBasic.prototype.getProperties= function(configRow){
    var temp={}
    var cf=this;
    configRow["properties"].forEach(function(d){
      if(temp[d["class"]]){
        temp[d["class"]].push(d["property"])
      }else{
        temp[d["class"]]=[d["property"]]
      }
    })
    return temp
  }

ConfigFileBasic.prototype.getTooltip= function(option_text){
  var cf=this;
  var selClass=cf.file.filter(function(d){
    return d.option_text==option_text
  })
  if(selClass[0]!=undefined){
    return selClass[0]["tooltip"]
  }else{
    return ""
  } 
}

function ConfigFileExpert(...args){
  ConfigFile.apply(this, args);
  }
  
ConfigFileExpert.prototype = Object.create(ConfigFile.prototype);

/* ConfigFileExpert.prototype.getProperties= function(configRow){

} */

ConfigFileExpert.prototype.init = function () {
  var cf=this;
  cf.position=["s","o"]
  //console.log(cf)
  cf.option=[]
  cf.file.forEach(element => {
    //console.log(element)
    //////console.log(configFileExpert)
    cf.position.forEach(position => {
      cf.option.push("Sparql Endpoint: " + element.sparqlEndpoint + " and Position: " + position)
    })
  })
  //"Sparql Endpoint: " + mi.selectedRows[i].endpoint_url + " and Position: " + mi.selectedRows[i]["option"]["position"]
}