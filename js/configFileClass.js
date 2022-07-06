ConfigFile = function (_file) {
    this.file=_file
    //this.parent=_parent
    this.init();
  };

ConfigFile.prototype.init = function () {
    var cf=this;
    ////////////////console.log(cf.file)
  }

ConfigFile.prototype.filterByValueField = function (value,field) {
    var cf=this;
    ////////////////console.log(cf.file)
    return cf.file.filter(d=>d[field]==value)
  }

ConfigFile.prototype.getRowNumber = function (option) {
    var cf=this;

    return cf.file.map(function (e) {
        return e.option;
      }).indexOf(option)
  }

ConfigFile.prototype.getFieldsConfigFile= function(rowDataConfig){
    var cf=this;
    return JSON.parse(JSON.stringify(cf.file[rowDataConfig]));
  }

ConfigFile.prototype.getRowsNodeClass= function(classNode){
    var configRows=[],classesText
    var cf=this;

    return cf.file.filter(d=>d.class==classNode)
  }

ConfigFile.prototype.getProperties= function(configRow){
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

/* ConfigFile.prototype.getClassesShow=function(rowDataConfig){
    var cf=this,tmp={}
    cf.file[rowDataConfig]["classes_text"].forEach(function(c){
      tmp[c["class"]]=c["text"]
    })
    return tmp
  } */
  //Get tooltip from Config File
// format: [{"property":....,"tooltip_text"},{"property2":....,"tooltip_text"}]
ConfigFile.prototype.getTooltip= function(option_text){
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