ConfigFile = function (_file) {
    this.file=_file
    //this.parent=_parent
    this.init();
  };

ConfigFile.prototype.init = function () {
    var cf=this;
    //////////console.log(cf.file)
  }

ConfigFile.prototype.filterByValueField = function (value,field) {
    var cf=this;
    //////////console.log(cf.file)
    return cf.file.filter(d=>d[field]==value)
  }

ConfigFile.prototype.getRowNumber = function (option) {
    var cf=this;

    return cf.file.map(function (e) {
        return e.option;
      }).indexOf(option)
  }

ConfigFile.prototype.getFieldsConfigFile= function(rowDataConfig){
    var url, query,hierarchy,properties_full,options,option_text
    var graphType,classes,parameters,filters,tooltip,columns,property_names,detail
  
    var cf=this;
    //////console.log(cf)
    ////console.log(cf.file[rowDataConfig])
    //////console.log(rowDataConfig)
    if(cf.file[rowDataConfig]["endpoint_url"]){
      endpoint_url=cf.file[rowDataConfig]["endpoint_url"]
    }else{
      endpoint_url=""
    }
  
    if(cf.file[rowDataConfig]["query"]){
      query=cf.file[rowDataConfig]["query"]
    }else{
      query=""
    }
  
    if(cf.file[rowDataConfig]["hierarchy"]){
      hierarchy=cf.file[rowDataConfig]["hierarchy"]
    }else{
      hierarchy=""
    }
    
    if(cf.file[rowDataConfig]["properties"]){
      properties_full=cf.file[rowDataConfig]["properties"]
    }else{
      properties_full=""
    }
    
    if(cf.file[rowDataConfig]["option"]){
      options=cf.file[rowDataConfig]["option"]
    }else{
      options=""
    }
  
    if(cf.file[rowDataConfig]["option_text"]){
      option_text=cf.file[rowDataConfig]["option_text"]
    }else{
      option_text=""
    }
  
    if(cf.file[rowDataConfig]["type"]){
      graphType=cf.file[rowDataConfig]["type"]
    }else{
      graphType=""
    }
  
    if(cf.file[rowDataConfig]["classes_text"]){
      classes=cf.file[rowDataConfig]["classes_text"]
    }else{
      classes=""
    }
    
    if(cf.file[rowDataConfig]["parameters"]){
      parameters=cf.file[rowDataConfig]["parameters"]
    }else{
      parameters=""
    }
  
    if(cf.file[rowDataConfig]["filters"]){
      filters=cf.file[rowDataConfig]["filters"]
    }else{
      filters=""
    }
  
    if(cf.file[rowDataConfig]["tooltip"]){
      tooltip=cf.file[rowDataConfig]["tooltip"]
    }else{
      tooltip=""
    }
  
    if(cf.file[rowDataConfig]["columns"]){
      columns=cf.file[rowDataConfig]["columns"]
    }else{
      columns=""
    }
    //////console.log(properties_full)
    if(get_property_names(properties_full)){
      property_names=get_property_names(properties_full)
    }else{
      property_names=""
    }
  
    if(cf.file[rowDataConfig]["details"]){
      detail=cf.file[rowDataConfig]["details"]
    }else{
      detail=""
    }
  
    return {"endpoint_url":endpoint_url,"query":query,"hierarchy":hierarchy,"properties":properties_full,
    "options":options,"option_text":option_text,"type":graphType,"classes":classes,"parameters":parameters,
    "filters":filters,"tooltip":tooltip,"columns":columns,"property_names":property_names,"detail":detail,"rowNumber":rowDataConfig}
  }

ConfigFile.prototype.getRowsNodeClass= function(classNode){
    var configRows=[],classesText
    var cf=this;

    ////console.log(cf)
    ////console.log(classNode)
    //classesText=cf.file["classes_text"].filter(d=>d.class==classNode)
    //////console.log(classesText)

    /* for(var i = 0; i < cf.file.length; i++) {
        ////console.log(cf.file[i])
        ////////console.log(classNode)
        ////////console.log(cf.file[i]["class"])
        ////////console.log(cf.file[i]["classes_text"])
        classesText=cf.file[i]["classes_text"].filter(d=>d.class==classNode)
        ////console.log(classesText)
        if(classesText.length>0){
            //////console.log(classesText)
            //////console.log(cf.file[i])
            if(classesText[0]["text"]==cf.file[i]["class"]){
                configRows.push(cf.file[i])
            }
        }
    } */
    //////console.log(configRows)
    return cf.file.filter(d=>d.class==classNode)
    /* for(var i = 0; i < cf.file.length; i++) {
      if(configFile[i]["class"]==classNode){
        configRows.push({"position":i,"option":configFile[i]["option"],"optionText":configFile[i]["option_text"]})
      }
    }
    return configRows */
  }

ConfigFile.prototype.getProperties= function(configRow){
    var temp={}
    var cf=this;
    //////console.log(configRow)
    configRow["properties"].forEach(function(d){
      if(temp[d["class"]]){
        temp[d["class"]].push(d["property"])
      }else{
        temp[d["class"]]=[d["property"]]
      }
    })
    return temp
  }

ConfigFile.prototype.getClassesShow=function(rowDataConfig){
    var cf=this,tmp={}
    //console.log(cf.file[rowDataConfig])
    cf.file[rowDataConfig]["classes_text"].forEach(function(c){
      //console.log(c)
      tmp[c["class"]]=c["text"]
    })
    ////console.log(tmp)
    return tmp
  }
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