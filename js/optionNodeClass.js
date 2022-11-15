OptionNode = function (_option,_node) {
    this.option=_option
    this.node=_node
    this.init()
  };

OptionNode.prototype.init = async function () {
  var on=this;
  ////////////////console.log(document.getElementsByTagName("table"))

  await on.buildOption()
  ////console.log(on)
}

function OptionNodeBasic(...args){
    OptionNode.apply(this, args);
    }
    
OptionNodeBasic.prototype = Object.create(OptionNode.prototype);

OptionNodeBasic.prototype.buildOption = async function () {
    var on=this;
    on.rowConfigFile=configFile.getRowNumber(on.option)
    on.query= configFile.file[on.rowConfigFile]["query"]
    on.askquery= configFile.file[on.rowConfigFile]["askquery"]
    on.parameters= configFile.file[on.rowConfigFile]["parameters"]
    on.endpoint_url=configFile.file[on.rowConfigFile]["endpoint_url"]
    //console.log(configFile.file)
    //console.log(on.rowConfigFile)
    //console.log(configFile.file[on.rowConfigFile]["askquery"])
    //console.log(on.askquery)
    on.fromSelectToAskQuery()
  }

/* OptionNodeBasic.prototype.buildCollapsedOption = async function (){
  OptionNodeBasic
} */
/* mi.indexRows[mi.indexRows.length - 1]["url"]=mi.indexRows[mi.indexRows.length - 1]["rowFields"]["endpoint_url"]
mi.indexRows[mi.indexRows.length - 1]["askquery"]=mi.indexRows[mi.indexRows.length - 1]["rowFields"]["askquery"] */
OptionNodeBasic.prototype.fromSelectToAskQuery = function(){
    var on=this;
    
    if(on["askquery"]=="None"){
      on.askquery=fromSelectToAskQuery(on.query)
    }
    //////////////console.log(cr.rowFields.askquery)
    ////////console.log(on["askquery"])
    on.replaceParmtrsQuery("askquery")
    ////////console.log(on["askquery"])
}

OptionNodeBasic.prototype.replaceParmtrsQuery = function(queryName){
  var on=this;
    /* var on=this;
    if(on.node!=undefined){
        if((on.parameters!="")&&(on.parameters!=null)){
            //////////////console.log(cr.rowFields.parameters)
            //////////////console.log(cr.node)
            //////////////console.log(cr.rowFields.askquery)
            for (let i = 0; i < on.parameters.length; ++i) { 
                on[queryName]=on[queryName].replaceAll("PARAMETER"+(i+2).toString(), on.node[on.parameters[i]["property"]]);
                //////////////console.log(cr.rowFields.parameters[i])
                //////////////console.log(cr.node[cr.rowFields.parameters[i]["property"]])
            } 
            //////////////console.log(cr.rowFields.askquery) 
        }
        on[queryName]=on[queryName].replaceAll("PARAMETER", on.node[on.node["class"]+"_uri"]);    
    } */
  if(on.node!=undefined) on[queryName]=replaceParmtrsQuery(on[queryName],on.parameters,on.node)
  }

function OptionNodeExpert(...args){
    OptionNode.apply(this, args);
    }
    
OptionNodeExpert.prototype = Object.create(OptionNode.prototype);

OptionNodeExpert.prototype.buildOption = async function () {
    var on=this;
    ////console.log(on.option)
    ////console.log(on.option.match("Sparql Endpoint: (.*) and Position:"))
    on.endpoint_url = on.option.match("Sparql Endpoint: (.*) and Position:")[1];
    on.position = on.option.match("and Position: (.*)")[1];
    //on.endpoint_url=on.option.endpoint_url
    on.query= "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?position=<PARAMETER>).}"
    on.askquery= "ASK WHERE{{ ?s ?p ?o.} FILTER (?position=<PARAMETER>).}".replace("position",on.position).replace("PARAMETER",on.node.uri)
    //on.replaceParmtrsQuery("askquery")
  }
