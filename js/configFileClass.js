ConfigFile = function (_file) {
    this.file=_file
    this.init();
  };

function ConfigFileBasic(...args){
  ConfigFile.apply(this, args);
  }
    
ConfigFileBasic.prototype = Object.create(ConfigFile.prototype);

ConfigFileBasic.prototype.init = function () {
  let cf=this;

}

ConfigFileBasic.prototype.getRowNumber = function (option) {
    let cf=this;

    return cf.file.map(function (e) {
        return e.option;
      }).indexOf(option)
  }

ConfigFileBasic.prototype.getFieldsConfigFile= function(rowDataConfig){
    let cf=this;
    return JSON.parse(JSON.stringify(cf.file[rowDataConfig]));
  }

ConfigFileBasic.prototype.getRowsNodeClass= function(classNode){
    let cf=this;

    return cf.file.filter(d=>d.class==classNode)
  }

function ConfigFileExpert(...args){
  ConfigFile.apply(this, args);
  }
  
ConfigFileExpert.prototype = Object.create(ConfigFile.prototype);

ConfigFileExpert.prototype.init = function () {
  let cf=this;
  cf.position=["s","o"]
  cf.option=[]
  console.log(JSON.parse(JSON.stringify(cf)))
  cf.file.forEach(element => {
    cf.position.forEach(position => {
      cf.option.push("Sparql Endpoint: " + element.sparqlEndpoint + " and Position: " + position)
    })
  })
}